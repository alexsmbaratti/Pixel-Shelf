const axios = require('axios');
var config = require('../config.json');

function IGDBDriver() {
    IGDBDriver.prototype.clientID = config.client_id;
    IGDBDriver.prototype.clientSecret = config.client_secret;
    IGDBDriver.prototype.token = config.token;
}