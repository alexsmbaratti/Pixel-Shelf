module.exports = {
    igdbClientID: function () {
        try {
            let clientID = require('../config.json')['client_id'];
            return clientID;
        } catch (e) {
            return process.env.IGDB_CLIENT_ID || null;
        }
    },
    igdbClientSecret: function () {
        try {
            let clientSecret = require('../config.json')['client_secret'];
            return clientSecret;
        } catch (e) {
            return process.env.IGDB_CLIENT_SECRET || null;
        }
    },
    mapsKey: function () {
        try {
            let mapsKey = require('../config.json')['maps-key-path'];
            return mapsKey;
        } catch (e) {
            return process.env.MAPS_KEY_PATH || null;
        }
    },
    mapsKeyID: function () {
        try {
            let mapsID = require('../config.json')['maps-key-id'];
            return mapsID;
        } catch (e) {
            return process.env.MAPS_KEY_ID || null;
        }
    },
    mapsTeamID: function () {
        try {
            let mapsTeamID = require('../config.json')['maps-team-id'];
            return mapsTeamID;
        } catch (e) {
            return process.env.MAPS_TEAM_ID || null;
        }
    },
    thermalPrinterEndpoint: function () {
        try {
            let thermalPrinterEndpoint = require('../config.json')['thermal-printer-endpoint'];
            return thermalPrinterEndpoint;
        } catch (e) {
            return process.env.THERMAL_PRINTER_ENDPOINT || null;
        }
    }
};