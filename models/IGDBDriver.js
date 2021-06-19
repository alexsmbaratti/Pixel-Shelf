const axios = require('axios');
var config = require('../config.json');

const https = require('https');
const fs = require('fs');

function IGDBDriver() {
    IGDBDriver.prototype.clientID = config.client_id;
    IGDBDriver.prototype.clientSecret = config.client_secret;
    IGDBDriver.prototype.token = config.token;
}

IGDBDriver.prototype.getGameByName = function getGameByName(name, gameID) {
    // TODO: TEST! This is still boilerplate!
    return new Promise(function (resolve, reject) {
        axios({
            method: 'post',
            url: 'https://api.igdb.com/v4/games/',
            headers: {
                'Client-ID': IGDBDriver.prototype.clientID,
                'Authorization': 'Bearer ' + IGDBDriver.prototype.token,
                'Content-Type': 'text/plain'
            },
            data: 'fields *; where name = \"' + name + '\";'
        })
            .then(function (res) {
                let resJSON = res.data;
                IGDBDriver.prototype.getCoverArtByID(resJSON[0].id).then(function (coverRes) {
                    resJSON['coverArt'] = coverRes;

                    const file = fs.createWriteStream(__dirname + "/../public/images/covers/" + gameID + ".jpg");
                    const request = https.get(coverRes, function (fileRes) {
                        fileRes.pipe(file);
                        resolve(resJSON);
                    });
                });
            })
            .catch(function (e) {
                console.log(e);
                reject(e);
            });
    });
}

IGDBDriver.prototype.getGameByURL = function getGameByURL(url, gameID) {
    return new Promise(function (resolve, reject) {
        axios({
            method: 'post',
            url: 'https://api.igdb.com/v4/games/',
            headers: {
                'Client-ID': IGDBDriver.prototype.clientID,
                'Authorization': 'Bearer ' + IGDBDriver.prototype.token,
                'Content-Type': 'text/plain'
            },
            data: 'fields *; where url = \"' + url + '\";'
        })
            .then(function (res) {
                let resJSON = res.data;
                console.log(resJSON);
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
            url: 'https://api.igdb.com/v4/games/',
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
                IGDBDriver.prototype.getCoverArtByID(resJSON[0].id).then(function (coverRes) {
                    const file = fs.createWriteStream(__dirname + "/../public/images/covers/" + gameID + ".jpg");
                    const request = https.get(coverRes, function (fileRes) {
                        fileRes.pipe(file);
                        resolve(resJSON);
                    });
                });
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
            url: 'https://api.igdb.com/v4/covers',
            headers: {
                'Client-ID': IGDBDriver.prototype.clientID,
                'Authorization': 'Bearer ' + IGDBDriver.prototype.token,
                'Content-Type': 'text/plain'
            },
            data: 'fields image_id; where game = ' + id + ';'
        })
            .then(function (res) {
                if (res.data.length > 0) {
                    let size = 'cover_big';
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

IGDBDriver.prototype.getGenresByIDs = function getGenresByIDs(ids) {
    return new Promise(function (resolve, reject) {
        let idText;
        if (ids.length == 0) {
            resolve();
        } else if (ids.length == 1) {
            idText = ids[0];
        } else {
            idText = '{'
            ids.forEach(id => {
                idText += id;
                idText += ',';
            });
            idText = idText.substring(0, idText.length - 1);
            idText += '}';
        }

        axios({
            method: 'post',
            url: 'https://api.igdb.com/v4/genres',
            headers: {
                'Client-ID': IGDBDriver.prototype.clientID,
                'Authorization': 'Bearer ' + IGDBDriver.prototype.token,
                'Content-Type': 'text/plain'
            },
            data: 'fields name; where checksum = ' + idText + ';'
        })
            .then(function (res) {
                if (res.data.length > 0) {
                    console.log(res.data);
                    resolve(res.data);
                } else { // There is no art for this game (yet)
                    reject();
                }
            })
            .catch(function (e) {
                console.log("Error in Genres");
                console.log(e);
                reject(e);
            });
    });
}

module.exports = IGDBDriver;