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
                            console.log("SELECT " + result.length + " rows queried from currency table");
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
                            console.log("SELECT " + result.length + " rows queried from platform and brand tables");
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
    },
    selectGameByID: function (gameID) {
        return new Promise(function (resolve, reject) {
            let db = new sqlite3.Database(dbName, sqlite3.OPEN_READONLY, (err) => {
                if (err) {
                    reject(err);
                } else {
                    db.get(`SELECT game.*, platform.*
                            FROM game,
                                 platform
                            WHERE game.id = ?
                              AND platform.id = platformid`, [gameID], (err, row) => {
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
    },
    selectPlatformByID: function (platformID) {
        return new Promise(function (resolve, reject) {
            let db = new sqlite3.Database(dbName, sqlite3.OPEN_READONLY, (err) => {
                if (err) {
                    reject(err);
                } else {
                    db.get(`SELECT platform.*
                            FROM platform
                            WHERE platform.id = ?`, [platformID], (err, row) => {
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
    },
    selectGenresByGame: function (gameID) {
        return new Promise(function (resolve, reject) {
            let db = new sqlite3.Database(dbName, sqlite3.OPEN_READONLY, (err) => {
                if (err) {
                    reject(err);
                } else {
                    db.all(`SELECT genre.*
                            FROM igdb,
                                 genre,
                                 hasagenre,
                                 game
                            WHERE genre.id = hasagenre.genreid
                              AND hasagenre.igdbURL = igdb.igdbURL
                              AND igdb.igdbURL = game.igdbURL
                              AND game.id = ?`, [gameID], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else if (!rows) {
                            reject();
                        } else {
                            resolve(rows);
                        }
                    });
                }
            });
        });
    },
    selectRatingsByGame: function (gameID) {
        return new Promise(function (resolve, reject) {
            let db = new sqlite3.Database(dbName, sqlite3.OPEN_READONLY, (err) => {
                if (err) {
                    reject(err);
                } else {
                    db.all(`SELECT rating.*
                            FROM igdb,
                                 rating,
                                 hasarating,
                                 game
                            WHERE rating.id = hasarating.ratingid
                              AND hasarating.igdbURL = igdb.igdbURL
                              AND igdb.igdbURL = game.igdbURL
                              AND game.id = ?`, [gameID], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else if (!rows) {
                            reject();
                        } else {
                            resolve(rows);
                        }
                    });
                }
            });
        });
    },
    selectLibraryEntries: function (sortBy = 'title', filters = []) {
        return new Promise(function (resolve, reject) {
            let parsedSortBy = parseLibrarySort(sortBy);
            let parsedFilters = parseLibraryFilters(filters);

            let db = new sqlite3.Database(dbName, sqlite3.OPEN_READONLY, (err) => {
                if (err) {
                    reject(err);
                } else {
                    db.all(`SELECT library.id,
                                   game.title,
                                   platform.name,
                                   library.timestamp,
                                   library.cost,
                                   library.gift,
                                   library.new,
                                   edition.edition
                            FROM game,
                                 platform,
                                 edition,
                                 library
                            WHERE editionid = edition.id
                              AND gameid = game.id
                              AND platform.id = platformid
                                ${parsedFilters}
                            ORDER BY ${parsedSortBy}`, [], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else if (!rows) {
                            reject();
                        } else {
                            resolve(rows);
                        }
                    });
                }
            });
        });
    }
}

function parseLibrarySort(sortBy = "title") {
    let parsedSortBy;
    switch (sortBy) {
        case 'title':
            parsedSortBy = "game.title ASC";
            break;
        case 'platform':
            parsedSortBy = "platform.name ASC, game.title ASC";
            break;
        case 'dateAdded':
            parsedSortBy = "library.timestamp ASC";
            break;
        case 'cost':
            parsedSortBy = "library.cost ASC, library.gift DESC";
            break;
        case 'edition':
            parsedSortBy = "edition.edition ASC";
            break;
        case 'id':
            parsedSortBy = "library.id ASC";
            break;
        default:
            parsedSortBy = "game.title ASC";
    }
    return parsedSortBy;
}

function parseLibraryFilters(filters = []) {
    let parsedFilters = "";
    filters.forEach(filter => {
        switch (filter) {
            case 'not-new':
                filter += "AND library.new != 1";
                break;
            case 'not-used':
                filter += "AND library.new != 0";
                break;
            case 'not-used':
                filter += "AND library.new != 0";
                break;
            default:
        }
    });
    return parsedFilters;
}