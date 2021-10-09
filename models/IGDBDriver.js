const axios = require('axios');

const https = require('https');
const fs = require('fs');

const create = require('./SQLiteUtils/CreateDriver');
const secrets = require('./SecretsDriver');

const version = 'v4';
var clientID = secrets.igdbClientID();
var clientSecret = secrets.igdbClientSecret();
var clientToken = null;

module.exports = {
    regenerateToken: function () {
        return new Promise(function (resolve, reject) {
            axios({
                method: 'post',
                url: `https://id.twitch.tv/oauth2/token?client_id=${clientID}&client_secret=${clientSecret}&grant_type=client_credentials`,
                headers: {}
            })
                .then(function (response) {
                    let data = response.data;
                    clientToken = data['access_token']; // Update the prototype's token
                })
                .catch(function (error) {
                    // TODO: Allow logging here after regenerateToken has been reworked
                    reject(error);
                });
        });
    },
    getGameByName: function (name) {
        return new Promise(function (resolve, reject) {
            axios({
                method: 'post',
                url: 'https://api.igdb.com/' + version + '/games/',
                headers: {
                    'Client-ID': clientID,
                    'Authorization': 'Bearer ' + clientToken,
                    'Content-Type': 'text/plain'
                },
                data: 'fields first_release_date, summary, url, age_ratings.rating, age_ratings.category, genres.name, cover.image_id; where name = \"' + name + '\";'
            })
                .then(function (res) {
                    let resJSON = res.data;
                    resolve(resJSON);
                    if (resJSON.length > 0) {
                        cacheMetadata(resJSON);
                    }
                })
                .catch(function (e) {
                    reject(e);
                });
        });
    },
    getGameByURL: function (url) {
        return new Promise(function (resolve, reject) {
            axios({
                method: 'post',
                url: 'https://api.igdb.com/' + version + '/games/',
                headers: {
                    'Client-ID': clientID,
                    'Authorization': 'Bearer ' + clientToken,
                    'Content-Type': 'text/plain'
                },
                data: 'fields first_release_date, summary, url, age_ratings.rating, age_ratings.category, genres.name, cover.image_id; where url = \"' + url + '\";'
            })
                .then(function (res) {
                    let resJSON = res.data;
                    resolve(resJSON);
                    if (resJSON.length > 0) {
                        cacheMetadata(resJSON);
                    }
                })
                .catch(function (e) {
                    reject(e);
                });
        });
    },
    getPlatformByName: function (name) {
        return new Promise(function (resolve, reject) {
            axios({
                method: 'post',
                url: 'https://api.igdb.com/' + version + '/platforms/',
                headers: {
                    'Client-ID': clientID,
                    'Authorization': 'Bearer ' + clientToken,
                    'Content-Type': 'text/plain'
                },
                data: 'fields *, platform_logo.*; where name = \"' + name + '\";'
            })
                .then(function (res) {
                    let resJSON = res.data;
                    resolve(resJSON);
                    if (resJSON.length > 0) {
                        cachePlatformMetadata(resJSON);
                    }
                })
                .catch(function (e) {
                    reject(e);
                });
        });
    },
    checkStatus: function () {
        return new Promise(function (resolve, reject) {
            axios({
                method: 'post',
                url: 'https://api.igdb.com/' + version + '/games',
                headers: {
                    'Client-ID': clientID,
                    'Authorization': 'Bearer ' + clientToken,
                    'Content-Type': 'text/plain'
                },
                data: 'where url = "https://www.igdb.com/games/gex";'
            })
                .then(function (res) {
                    if (res.status === 200) {
                        resolve();
                    } else {
                        reject("Received non-200 status code");
                    }
                })
                .catch(function (e) {
                    reject(e);
                });
        });
    }
}

function cacheMetadata(resJSON) {
    if (resJSON[0]['cover']) {
        let size = 'cover_big_2x';
        let imageID = resJSON[0]['cover']['image_id'];
        https.get(`https://images.igdb.com/igdb/image/upload/t_${size}/${imageID}.jpg`, function (fileRes) {
            let imagePath = "/images/covers/" + imageID + ".jpg";
            const file = fs.createWriteStream(__dirname + "/../public" + imagePath);
            fileRes.pipe(file);
            create.insertIGDB(resJSON[0]['url'], resJSON[0]['summary'], resJSON[0]['first_release_date'], imagePath).catch(err => {
                console.log(err);
            });
        }).on('error', function (err) {
        });
    } else {
        create.insertIGDB(resJSON[0]['url'], resJSON[0]['summary'], resJSON[0]['first_release_date'], null).catch(err => {
            console.log(err);
        });
    }
    resJSON[0]['genres'].forEach(genre => {
        create.insertGenre(genre['id'], genre['name']).catch(err => {
        });
        create.insertHasAGenre(genre['id'], resJSON[0]['url']).catch(err => {
        });
    });
    resJSON[0]['age_ratings'].forEach(ageRating => {
        let category;
        switch (ageRating['category']) {
            case 1:
                category = 'ESRB';
                break;
            case 2:
                category = 'PEGI';
                break;
            default:
                category = 'Unknown';
        }
        create.insertRating(ageRating['rating'], category).catch(err => {
        });
        create.insertHasARating(ageRating['rating'], resJSON[0]['url']).catch(err => {
        });
    });
}

function cachePlatformMetadata(resJSON) {
    if (resJSON[0]['platform_logo']) {
        let size = 'logo_med_2x';
        let imageID = resJSON[0]['platform_logo']['image_id'];
        https.get(`https://images.igdb.com/igdb/image/upload/t_${size}/${imageID}.jpg`, function (fileRes) {
            let imagePath = "/images/logos/" + imageID + ".jpg";
            const file = fs.createWriteStream(__dirname + "/../public" + imagePath);
            fileRes.pipe(file);
            create.insertIGDBPlatform(resJSON[0]['url'], resJSON[0]['summary'], resJSON[0]['category'], imagePath, resJSON[0]['generation']).catch(err => {
                console.log(err);
            });
        }).on('error', function (err) {
        });
    } else {
        create.insertIGDBPlatform(resJSON[0]['url'], resJSON[0]['summary'], resJSON[0]['category'], null, resJSON[0]['generation']).catch(err => {
            console.log(err);
        });
    }
}