const axios = require('axios');
var config = require('../config.json');

function IGDBDriver() {
    IGDBDriver.prototype.clientID = config.client_id;
    IGDBDriver.prototype.clientSecret = config.client_secret;
    IGDBDriver.prototype.token = config.token;
}

IGDBDriver.prototype.getGameByURL = function getGameByURL(url) {
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
                console.log(JSON.stringify(res.data));
                resolve(res);
            })
            .catch(function (e) {
                console.log(e);
                reject(e);
            });
    });
}

module.exports = IGDBDriver;