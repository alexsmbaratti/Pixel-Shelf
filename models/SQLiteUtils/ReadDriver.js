const sqlite3 = require('sqlite3');
const dbName = './models/db/pixelshelf.db';

module.exports = {
    selectCurrencies: function () {
        return new Promise(function (resolve, reject) {
            let db = new sqlite3.Database(dbName, sqlite3.OPEN_READONLY, (err) => {
                if (err) {
                    reject(err);
                } else {
                    db.all(`SELECT *
                            FROM currency`, [], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            let result = [];
                            rows.forEach((row) => {
                                result.push({
                                    "code": row['code'],
                                    "label": row['label'],
                                    "symbol": row['symbol']
                                });
                            });
                            console.log(`SELECT ${result.length} rows queried from currency table`);
                            resolve(result);
                        }
                    });
                }
            });
        });
    },
    selectPlatforms: function () {
        return new Promise(function (resolve, reject) {
            let db = new sqlite3.Database(dbName, sqlite3.OPEN_READONLY, (err) => {
                if (err) {
                    reject(err);
                } else {
                    db.all(`SELECT platform.*, brand.brand
                            FROM platform,
                                 brand
                            WHERE platform.brandid = brand.id
                            ORDER BY platform.name ASC`, [], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            let result = [];
                            rows.forEach((row) => {
                                result.push({
                                    "id": row.id,
                                    "name": row.name,
                                    "brand": row.brand
                                });
                            });
                            console.log(`SELECT ${result.length} rows queried from platform and brand tables`);
                            resolve(result);
                        }
                    });
                }
            });
        });
    },
    selectIGDBByGame: function (gameID) {
        return new Promise(function (resolve, reject) {
            let db = new sqlite3.Database(dbName, sqlite3.OPEN_READONLY, (err) => {
                if (err) {
                    reject(err);
                } else {
                    db.get(`SELECT igdb.*
                            FROM igdb,
                                 game
                            WHERE igdb.igdbURL = game.igdbURL
                              AND game.id = ?`, [gameID], (err, row) => {
                        if (err) {
                            reject(err);
                        } else if (!row) {
                            reject();
                        } else {
                            resolve(row);
                        }
                    });
                }
            });
        });
    }
}