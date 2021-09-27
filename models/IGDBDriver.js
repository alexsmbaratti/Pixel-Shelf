const axios = require('axios');
var config = require('../config.json');

const https = require('https');
const fs = require('fs');

const create = require('./SQLiteUtils/CreateDriver');

function IGDBDriver() {
    IGDBDriver.prototype.clientID = config.client_id;
    IGDBDriver.prototype.clientSecret = config.client_secret;
    IGDBDriver.prototype.token = config.token;
    IGDBDriver.prototype.version = 'v4';
}

IGDBDriver.prototype.regenerateToken = function regenerateToken() {
    return new Promise(function (resolve, reject) {
        axios({
            method: 'post',
            url: `https://id.twitch.tv/oauth2/token?client_id=${IGDBDriver.prototype.clientID}&client_secret=${IGDBDriver.prototype.clientSecret}&grant_type=client_credentials`,
            headers: {}
        })
            .then(function (response) {
                let data = response.data;
                IGDBDriver.prototype.token = data['access_token']; // Update the prototype's token
                fs.readFile('config.json', 'utf8', function (err, configObject) { // Update the file's token
                    if (err) {
                        reject(err);
                    } else {
                        let temp = JSON.parse(configObject);
                        temp['token'] = data['access_token'];
                        let json = JSON.stringify(temp);
                        fs.writeFile('config.json', json, 'utf8', function () {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
                    }
                });
            })
            .catch(function (error) {
                reject(error);
            });
    });
}

IGDBDriver.prototype.getGameByName = function getGameByName(name) {
    return new Promise(function (resolve, reject) {
        axios({
            method: 'post',
            url: 'https://api.igdb.com/' + IGDBDriver.prototype.version + '/games/',
            headers: {
                'Client-ID': IGDBDriver.prototype.clientID,
                'Authorization': 'Bearer ' + IGDBDriver.prototype.token,
                'Content-Type': 'text/plain'
            },
            data: 'fields first_release_date, summary, url, age_ratings.rating, genres.name, cover.image_id; where name = \"' + name + '\";'
        })
            .then(function (res) {
                let resJSON = res.data;
                resolve(resJSON);
                if (resJSON.length > 0) {
                    let coverBytes = null;
                    if (resJSON[0]['cover']) {
                        let size = 'cover_big_2x';
                        let imageID = resJSON[0]['cover']['image_id'];
                        const request = https.get(`https://images.igdb.com/igdb/image/upload/t_${size}/${imageID}.jpg`, function (fileRes) {
                            var blob = "";
                            fileRes.on("data", function (chunk) {
                                blob += chunk;
                            });
                            fileRes.on('end', function () {
                                create.insertIGDB(resJSON[0]['url'], resJSON[0]['summary'], resJSON[0]['first_release_date'], blob).catch(err => {
                                    console.log(err);
                                });
                            });
                        }).on('error', function (err) {
                            console.log(err);
                        });
                    } else {
                        create.insertIGDB(resJSON[0]['url'], resJSON[0]['summary'], resJSON[0]['first_release_date'], coverBytes).catch(err => {
                            console.log(err);
                        });
                    }
                }
            })
            .catch(function (e) {
                console.log(e);
                reject(e);
            });
    });
}

IGDBDriver.prototype.getGameByURL = function getGameByURL(url) {
    return new Promise(function (resolve, reject) {
        axios({
            method: 'post',
            url: 'https://api.igdb.com/' + IGDBDriver.prototype.version + '/games/',
            headers: {
                'Client-ID': IGDBDriver.prototype.clientID,
                'Authorization': 'Bearer ' + IGDBDriver.prototype.token,
                'Content-Type': 'text/plain'
            },
            data: 'fields *, genres.name, age_ratings.*; where url = \"' + url + '\";'
        })
            .then(function (res) {
                let resJSON = res.data;
                resolve(resJSON);
            })
            .catch(function (e) {
                console.log("Error in Game Info");
                console.log(e);
                reject(e);
            });
    });
}

IGDBDriver.prototype.getCoverByURL = function getCoverByURL(url, gameID) {
    return new Promise(function (resolve, reject) {
        if (url == undefined) {
            reject();
        }
        axios({
            method: 'post',
            url: 'https://api.igdb.com/' + IGDBDriver.prototype.version + '/games/',
            headers: {
                'Client-ID': IGDBDriver.prototype.clientID,
                'Authorization': 'Bearer ' + IGDBDriver.prototype.token,
                'Content-Type': 'text/plain'
            },
            data: 'fields *; where url = \"' + url + '\";'
        })
            .then(function (res) {
                console.log("Caching cover art from IGDB...");
                let resJSON = res.data;
                if (resJSON.length > 0) {
                    IGDBDriver.prototype.getCoverArtByID(resJSON[0].id).then(function (coverRes) {
                        const file = fs.createWriteStream(__dirname + "/../public/images/covers/" + gameID + ".jpg");
                        const request = https.get(coverRes, function (fileRes) {
                            fileRes.pipe(file);
                            resolve(resJSON);
                        });
                    });
                } else {
                    reject();
                }
            })
            .catch(function (e) {
                console.log("Error in Game Info");
                console.log(e);
                reject(e);
            });
    });
}

IGDBDriver.prototype.getCoverArtByID = function getCoverArtByID(id) {
    return new Promise(function (resolve, reject) {
        axios({
            method: 'post',
            url: 'https://api.igdb.com/' + IGDBDriver.prototype.version + '/covers',
            headers: {
                'Client-ID': IGDBDriver.prototype.clientID,
                'Authorization': 'Bearer ' + IGDBDriver.prototype.token,
                'Content-Type': 'text/plain'
            },
            data: 'fields image_id; where game = ' + id + ';'
        })
            .then(function (res) {
                if (res.data.length > 0) {
                    let size = 'cover_big_2x';
                    let imageID = res.data[0]["image_id"];
                    let url = `https://images.igdb.com/igdb/image/upload/t_${size}/${imageID}.jpg`
                    resolve(url);
                } else { // There is no art for this game (yet)
                    reject();
                }
            })
            .catch(function (e) {
                console.log("Error in Cover Art");
                console.log(e);
                reject(e);
            });
    });
}

IGDBDriver.prototype.checkStatus = function checkStatus() {
    return new Promise(function (resolve, reject) {
        axios({
            method: 'post',
            url: 'https://api.igdb.com/' + IGDBDriver.prototype.version + '/games',
            headers: {
                'Client-ID': IGDBDriver.prototype.clientID,
                'Authorization': 'Bearer ' + IGDBDriver.prototype.token,
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

module.exports = IGDBDriver;