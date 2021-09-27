const sqlite3 = require('sqlite3');
const dbName = './models/db/pixelshelf.db';

module.exports = {
    insertGame: function (title, platformID, igdbURL = null) {
        return new Promise(function (resolve, reject) {
            if (title && platformID) {
                let db = new sqlite3.Database(dbName, sqlite3.OPEN_READWRITE, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        db.run(`INSERT
                                INTO game
                                VALUES (?, ?, ?, ?)`, [title, platformID, igdbURL], function (err) {
                            if (err) {
                                reject(err);
                            } else {
                                let gameID = this.lastID;
                                console.log(`INSERT ${title} was inserted into game table with ID ${gameID}`);
                                resolve(gameID);
                            }
                        });
                    }
                });
            } else {
                reject({status: 400});
            }
        });
    },
    insertEdition: function (edition, gameID, upc = null, msrp = null, currencyCode = 'USD', isDigital = false, region = null) {
        return new Promise(function (resolve, reject) {
            if (edition && gameID) {
                let db = new sqlite3.Database(dbName, sqlite3.OPEN_READWRITE, function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        db.run(`INSERT
                                INTO edition
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [edition, upc, msrp, gameID, isDigital ? 1 : 0, currencyCode, region], function (err) {
                            if (err) {
                                console.log(err);
                                reject(err);
                            } else {
                                let editionID = this.lastID;
                                console.log(`INSERT ${edition} was inserted into edition table with ID ${editionID}`);
                                resolve(editionID);
                            }
                        });
                    }
                });
            } else {
                reject({status: 400});
            }
        });
    },
    insertLibraryEntry: function (editionID, cost = null, currencyCode = 'USD', timestamp = null, retailerID = null, isNew = true, hasBox = true, hasManual = true, isGift = false, isPrivate = false, notes = null) {
        return new Promise(function (resolve, reject) {
            if (editionID) {
                let db = new sqlite3.Database(dbName, sqlite3.OPEN_READWRITE, function (err) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        db.run(`INSERT
                                INTO library
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [cost, timestamp, editionID, retailerID, isNew ? 1 : 0, hasBox ? 1 : 0, hasManual ? 1 : 0, 0, isGift ? 1 : 0, currencyCode, isPrivate ? 1 : 0, notes], function (err) {
                            if (err) {
                                console.log(err);
                                reject(err);
                            } else {
                                let libraryID = this.lastID;
                                console.log(`INSERT A row was inserted into library table with ID ${libraryID}`);
                                resolve(libraryID);
                            }
                        });
                    }
                });
            } else {
                reject({status: 400});
            }
        });
    }
}