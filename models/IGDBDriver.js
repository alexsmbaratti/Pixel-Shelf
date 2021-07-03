const axios = require('axios');
var config = require('../config.json');

const https = require('https');
const fs = require('fs');

function IGDBDriver() {
    IGDBDriver.prototype.clientID = config.client_id;
    IGDBDriver.prototype.clientSecret = config.client_secret;
    IGDBDriver.prototype.token = config.token;
    IGDBDriver.prototype.version = 'v4';
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
            data: 'fields *, genres.name; where name = \"' + name + '\";'
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
                    reject("Recieved non-200 status code");
                }
            })
            .catch(function (e) {
                reject(e);
            });
    });
}

module.exports = IGDBDriver;