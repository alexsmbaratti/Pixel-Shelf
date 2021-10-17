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
    selectIGDBByPlatform: function (platformID) {
        return new Promise(function (resolve, reject) {
            let db = new sqlite3.Database(dbName, sqlite3.OPEN_READONLY, (err) => {
                if (err) {
                    reject(err);
                } else {
                    db.get(`SELECT igdbplatform.*
                            FROM igdbplatform,
                                 platform
                            WHERE igdbplatform.igdbURL = platform.igdbURL
                              AND platform.id = ?`, [platformID], (err, row) => {
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
                    db.get(`SELECT game.*, platform.name, platform.brandid
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
                            resolve([]);
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
    if (filters.length == 0) {
        return "";
    } else {
        let parsedFilters = [];
        filters.forEach(filter => {
            switch (filter) {
                case 'not-new': // Filter out new library entries
                    parsedFilters.push("library.new != 1");
                    break;
                case 'not-used': // Filter out used library entries
                    parsedFilters.push("library.new != 0");
                    break;
                case 'not-gift': // Filter out gifted library entries
                    parsedFilters.push("library.gift != 1");
                    break;
                case 'not-box': // Filter out library entries with a box/case
                    parsedFilters.push("library.box != 1");
                    break;
                case 'not-manual': // Filter out library entries with a manual
                    parsedFilters.push("library.manual != 1");
                    break;
                case 'not-digital': // Filter out library entries that are digital
                    parsedFilters.push("edition.digital != 1");
                    break;
                case 'not-physical': // Filter out library entries that are physical
                    parsedFilters.push("edition.digital != 0");
                    break;
                case 'not-complete': // Filter out completed library entries
                    parsedFilters.push("library.progress != 3");
                    break;
                case 'not-in-progress': // Filter out in progress library entries
                    parsedFilters.push("library.progress != 2");
                    break;
                case 'not-backlog': // Filter out backlog library entries
                    parsedFilters.push("library.progress != 1");
                    break;
                case 'not-purchased': // Filter out purchased (uncategorized) library entries
                    parsedFilters.push("library.progress != 0");
                    break;
                case 'not-standard': // Filter out Standard Edition library entries
                    parsedFilters.push("edition.edition != 'Standard Edition'");
                    break;
                case 'standard-only': // Filter out non-Standard Edition library entries
                    parsedFilters.push("edition.edition = 'Standard Edition'");
                    break;
                case 'not-below-msrp': // Filter out below-MSRP library entries
                    parsedFilters.push("(edition.msrp <= library.cost OR library.cost IS NULL)");
                    break;
                case 'not-above-msrp': // Filter out above-MSRP library entries
                    parsedFilters.push("(edition.msrp >= library.cost OR library.cost IS NULL)");
                    break;
                case 'no-null-cost': // Filter out library entries without a cost
                    parsedFilters.push("library.cost IS NOT NULL");
                    break;
                case 'not-msrp': // Filter out cost equal MSRP library entries
                    parsedFilters.push("(edition.msrp != library.cost OR library.cost IS NULL)");
                    break;
                case 'no-date-added': // Filter out library entries with a timestamp
                    parsedFilters.push("library.timestamp IS NULL");
                    break;
                case 'no-cost': // Filter out library entries with a cost
                    parsedFilters.push("library.cost IS NULL");
                    break;
                case 'no-retailer': // Filter out library entries with a retailer
                    parsedFilters.push("library.retailerid IS NULL");
                    break;
                default:
            }
        });

        return ' AND ' + parsedFilters.join(' AND ');
    }
}