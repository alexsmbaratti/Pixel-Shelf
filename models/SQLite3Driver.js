const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

function SQLite3Driver() {
    SQLite3Driver.prototype.dbName = './models/db/pixelshelf.db';
}

SQLite3Driver.prototype.getLibrary = function getLibrary(sortBy) {
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
            parsedSortBy = "library.cost ASC";
            break;
        case 'edition':
            parsedSortBy = "edition.edition ASC";
            break;
        default:
            parsedSortBy = "game.title ASC";
    }
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            }
            let sql = `SELECT library.id,
                              game.title,
                              platform.name,
                              library.timestamp,
                              library.cost,
                              edition.edition
                       FROM game,
                            platform,
                            edition,
                            library
                       WHERE editionid = edition.id
                         AND gameid = game.id
                         AND platform.id = platformid
                       ORDER BY ${parsedSortBy}`;
            SQLite3Driver.prototype.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    let result = [];
                    rows.forEach((row) => {
                        result.push({
                            "id": row.id,
                            "title": row.title,
                            "platform": row.name,
                            "dateAdded": row.timestamp,
                            "cost": row.cost === null ? null : (Math.round(row.cost * 100) / 100).toFixed(2),
                            "edition": row.edition
                        });
                    });
                    resolve(result);
                }
            });
        });
    });
}

SQLite3Driver.prototype.getBacklog = function getBacklog(sortBy) {
    let parsedSortBy;
    switch (sortBy) {
        case 'title':
            parsedSortBy = "game.title";
            break;
        case 'platform':
            parsedSortBy = "platform.name ASC, game.title";
            break;
        case 'dateAdded':
            parsedSortBy = "library.timestamp ASC";
            break;
        case 'cost':
            parsedSortBy = "library.cost";
            break;
        case 'edition':
            parsedSortBy = "edition.edition";
            break;
        default:
            parsedSortBy = "game.title";
    }
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            }
            let sql = `SELECT library.id,
                              game.title,
                              platform.name,
                              library.timestamp,
                              library.cost,
                              edition.edition
                       FROM game,
                            platform,
                            edition,
                            library
                       WHERE editionid = edition.id
                         AND library.progress = 1
                         AND gameid = game.id
                         AND platform.id = platformid
                       ORDER BY ${parsedSortBy} ASC`;
            SQLite3Driver.prototype.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    let result = [];
                    rows.forEach((row) => {
                        result.push({
                            "id": row.id,
                            "title": row.title,
                            "platform": row.name,
                            "dateAdded": row.timestamp,
                            "cost": row.cost === null ? null : (Math.round(row.cost * 100) / 100).toFixed(2),
                            "edition": row.edition
                        });
                    });

                    resolve(result);
                }
            });
        });
    });
}

SQLite3Driver.prototype.getWishlist = function getWishlist(sortBy) {
    let parsedSortBy;
    switch (sortBy) {
        case 'title':
            parsedSortBy = "game.title";
            break;
        case 'platform':
            parsedSortBy = "platform.name ASC, game.title";
            break;
        case 'msrp':
            parsedSortBy = "edition.msrp";
            break;
        case 'edition':
            parsedSortBy = "edition.edition";
            break;
        default:
            parsedSortBy = "game.title";
    }

    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            }
            let sql = `SELECT wishlist.*, game.title, platform.name, edition.edition, edition.msrp
                       FROM game,
                            platform,
                            edition,
                            wishlist
                       WHERE editionid = edition.id
                         AND gameid = game.id
                         AND platform.id = platformid
                       ORDER BY ${parsedSortBy} ASC`;
            SQLite3Driver.prototype.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    let result = [];
                    rows.forEach((row) => {
                        result.push({
                            "id": row.id,
                            "title": row.title,
                            "platform": row.name,
                            "msrp": row.msrp,
                            "edition": row.edition
                        });
                    });

                    resolve(result);
                }
            });
        });
    });
}

SQLite3Driver.prototype.getFigures = function getFigures(sortBy) {
    let parsedSortBy;
    switch (sortBy) {
        case 'title':
            parsedSortBy = "amiibo.title ASC, series.series ASC";
            break;
        case 'series':
            parsedSortBy = "series.series ASC, amiibo.title ASC";
            break;
        case 'dateAdded':
            parsedSortBy = "figure.timestamp ASC, amiibo.title ASC, series.series ASC";
            break;
        case 'cost':
            parsedSortBy = "figure.cost ASC, amiibo.title ASC, series.series ASC";
            break;
        case 'type':
            parsedSortBy = "amiibo.type ASC, amiibo.title ASC, series.series ASC";
            break;
        default:
            parsedSortBy = "amiibo.title ASC, series.series ASC";
    }
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            }
            let sql = `SELECT figure.id,
                              amiibo.title,
                              series.series,
                              figure.timestamp,
                              amiibo.msrp,
                              figure.cost,
                              figure.new,
                              amiibo.type,
                              figure.inbox
                       FROM amiibo,
                            series,
                            figure
                       WHERE seriesid = series.id
                         AND amiiboid = amiibo.id
                       ORDER BY ${parsedSortBy}`;
            SQLite3Driver.prototype.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    let result = [];
                    rows.forEach((row) => {
                        let type;
                        switch (row.type) {
                            case 0:
                                type = 'Figure';
                                break;
                            case 1:
                                type = 'Card';
                                break;
                            case 2:
                                type = 'Plush';
                                break;
                            case 3:
                                type = 'Other';
                                break;
                            default:
                                type = 'Unknown Type';
                        }

                        result.push({
                            "id": row.id,
                            "title": row.title,
                            "series": row.series,
                            "type": type,
                            "dateAdded": row.timestamp,
                            "cost": row.cost === null ? null : (Math.round(row.cost * 100) / 100).toFixed(2)
                        });
                    });

                    resolve(result);
                }
            });
        });
    });
}

SQLite3Driver.prototype.getFigure = function getFigure(id) {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            }
            let sql = `SELECT figure.id,
                              amiibo.title,
                              series.series,
                              figure.timestamp,
                              amiibo.msrp,
                              figure.cost,
                              figure.new,
                              figure.inbox,
                              amiibo.type,
                              figure.retailerid,
                              amiibo.seriesid,
                              figure.amiiboid
                       FROM amiibo,
                            series,
                            figure
                       WHERE seriesid = series.id
                         AND amiiboid = amiibo.id
                         AND figure.id = ?
                       LIMIT 1`;

            SQLite3Driver.prototype.db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    let type;
                    switch (row.type) {
                        case 0:
                            type = 'Figure';
                            break;
                        case 1:
                            type = 'Card';
                            break;
                        case 2:
                            type = 'Plush';
                            break;
                        case 3:
                            type = 'Other';
                            break;
                        default:
                            type = 'Unknown Type';
                    }

                    resolve({
                        "id": row.id,
                        "title": row.title,
                        "series": row.series,
                        "dateAdded": row.timestamp,
                        "cost": row.cost === null ? null : (Math.round(row.cost * 100) / 100).toFixed(2),
                        "msrp": row.msrp === null ? null : (Math.round(row.msrp * 100) / 100).toFixed(2),
                        "new": row.new == 1,
                        "inbox": row.inbox == 1,
                        "date": row.timestamp,
                        "type": type,
                        "amiiboID": row.amiiboid,
                        "seriesID": row.seriesid,
                        "retailerID": row.retailerid
                    });
                }
            });
        });
    });
}

SQLite3Driver.prototype.getPlatforms = function getPlatforms() {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            }
            let sql = `SELECT platform.*, brand.brand
                       FROM platform,
                            brand
                       WHERE platform.brandid = brand.id
                       ORDER BY platform.name ASC`;
            SQLite3Driver.prototype.db.all(sql, [], (err, rows) => {
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

                    resolve(result);
                }
            });
        });
    });
}

SQLite3Driver.prototype.getPlatform = function getPlatform(id) {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            }
            let sql = `SELECT platform.*, brand.brand
                       FROM platform,
                            brand
                       WHERE platform.brandid = brand.id
                         AND platform.id = ?`;
            SQLite3Driver.prototype.db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                }

                resolve({
                    "id": row.id,
                    "name": row.name,
                    "brand": row.brand
                });
            });
        });
    });
}

SQLite3Driver.prototype.getGame = function getGame(id) {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            }
            let sql = `SELECT game.*, platform.*
                       FROM game,
                            platform
                       WHERE game.id = ?
                         AND platform.id = platformid`;
            SQLite3Driver.prototype.db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                }
                let result = {};
                let igdbURL;
                if (row.igdbURL === undefined) {
                    igdbURL = null;
                } else {
                    igdbURL = row.igdbURL;
                }

                result = {
                    "id": id,
                    "title": row.title,
                    "platform": row.name,
                    "igdbURL": igdbURL
                };
                resolve(result);
            });
        });
    });
}

SQLite3Driver.prototype.getLibraryGame = function getLibraryGame(id) {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            }
            let sql = `SELECT game.*, platform.*, edition.*, library.*
                       FROM library,
                            game,
                            platform,
                            edition
                       WHERE editionid = edition.id
                         AND gameid = game.id
                         AND platform.id = platformid
                         AND library.id = ?
                       LIMIT 1`;
            // TODO: Change to get
            SQLite3Driver.prototype.db.all(sql, [id], (err, rows) => {
                if (err) {
                    reject(err);
                }
                let result = {};

                try {
                    rows.forEach((row) => {

                        let igdbURL;
                        if (row.igdbURL === undefined) {
                            igdbURL = null;
                        } else {
                            igdbURL = row.igdbURL;
                        }

                        result = {
                            "title": row.title,
                            "platform": row.name,
                            "cost": row.cost,
                            "msrp": row.msrp,
                            "upc": row.upc,
                            "edition": row.edition,
                            "new": row.new == 1,
                            "box": row.box == 1,
                            "manual": row.manual == 1,
                            "igdbURL": igdbURL,
                            "date": row.timestamp,
                            "gameID": row.gameid,
                            "editionID": row.editionid,
                            "retailerID": row.retailerid,
                            "progress": row.progress
                        };
                    });
                } catch (e) {
                    reject(e);
                }
                resolve(result);
            });
        });
    });
}

SQLite3Driver.prototype.getWishlistGame = function getWishlistGame(id) {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            }
            let sql = `
                SELECT game.*,
                       platform.*,
                       edition.*,
                       wishlist.*
                FROM wishlist,
                     game,
                     platform,
                     edition
                WHERE editionid = edition.id
                  AND gameid = game.id
                  AND platform.id = platformid
                  AND wishlist.id = ?
                LIMIT 1`;
            // TODO: Change to get
            SQLite3Driver.prototype.db.all(sql, [id], (err, rows) => {
                if (err) {
                    reject(err);
                }
                let result = {};
                try {
                    rows.forEach((row) => {
                        let igdbURL;
                        if (row.igdbURL === undefined) {
                            igdbURL = null;
                        } else {
                            igdbURL = row.igdbURL;
                        }

                        result = {
                            "title": row.title,
                            "platform": row.name,
                            "msrp": row.msrp,
                            "edition": row.edition,
                            "igdbURL": igdbURL,
                            "gameID": row.gameid
                        };
                    });
                } catch (e) {
                    reject(e);
                }
                resolve(result);
            });
        });
    });
}

SQLite3Driver.prototype.addGame = function addGame(json) {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READWRITE, function (err) {
            if (err) {
                console.log(err);
                reject(err);
            }
            SQLite3Driver.prototype.db.run(`
                INSERT
                INTO game
                VALUES (?, ?, ?, ?)`, [json.title, json.platform, json['igdb-url']], function (err) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                let gameID = this.lastID;
                console.log(`${json.title} was inserted with ID ${gameID}`);
                resolve(gameID);
            });
        });
    });
}

SQLite3Driver.prototype.addEdition = function addEdition(json) {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READWRITE, function (err) {
            if (err) {
                console.log(err);
                reject(err);
            }
            SQLite3Driver.prototype.db.run(`INSERT
                                            INTO edition
                                            VALUES (?, ?, ?, ?, ?, ?)`, [json.edition, json.upc, json.msrp, json.gameID], function (err) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    let editionID = this.lastID;
                    console.log(`${json.edition} was inserted with ID ${editionID}`);
                    resolve(editionID);
                }
            });
        });
    });
}

SQLite3Driver.prototype.addLibrary = function addLibrary(json) {
    if (json.condition == null) {
        json.condition = true; // Default to true
    }
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READWRITE, function (err) {
            if (err) {
                console.log(err);
                reject(err);
            }
            SQLite3Driver.prototype.db.run(`INSERT
                                            INTO library
                                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [json.cost, json.timestamp, json.editionID, json.retailerID, json['condition'] ? 1 : 0, json.box ? 1 : 0, json.manual ? 1 : 0, 0], function (err) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    let libraryID = this.lastID;
                    console.log(`A library entry was inserted with ID ${libraryID}`);
                    resolve(libraryID);
                }
            });
        });
    });
}

SQLite3Driver.prototype.addSeries = function addSeries(json) {
    return new Promise(function (resolve, reject) {
        if (json['series'].length === 0) {
            reject('Invalid series name');
        } else {
            SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READWRITE, function (err) {
                if (err) {
                    reject(err);
                }
                SQLite3Driver.prototype.db.run(`INSERT
                                                INTO series
                                                VALUES (?, ?)`, [json.series], function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        let seriesID = this.lastID;
                        console.log(`A series entry was inserted with ID ${seriesID}`);
                        resolve(seriesID);
                    }
                });
            });
        }
    });
}

SQLite3Driver.prototype.addAmiibo = function addAmiibo(json) {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READWRITE, function (err) {
            if (err) {
                reject(err);
            }
            SQLite3Driver.prototype.db.run(`INSERT
                                            INTO amiibo
                                            VALUES (?, ?, ?, ?, ?)`, [json.title, json.seriesID, json.msrp, json.type], function (err) {
                if (err) {
                    reject(err);
                } else {
                    let amiiboID = this.lastID;
                    console.log(`A amiibo entry was inserted with ID ${amiiboID}`);
                    resolve(amiiboID);
                }
            });
        });

    });
}

SQLite3Driver.prototype.addFigure = function addFigure(json) {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READWRITE, function (err) {
            if (err) {
                reject(err);
            }
            SQLite3Driver.prototype.db.run(`INSERT
                                            INTO figure
                                            VALUES (?, ?, ?, ?, ?, ?, ?)`, [json.cost, json.timestamp, json.retailerID, json['condition'] ? 1 : 0, json['inbox'] ? 1 : 0, json.amiiboID], function (err) {
                if (err) {
                    reject(err);
                } else {
                    let figureID = this.lastID;
                    console.log(`A figure entry was inserted with ID ${figureID}`);
                    resolve(figureID);
                }
            });
        });

    });
}

SQLite3Driver.prototype.addRetailer = function addRetailer(json) {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READWRITE, function (err) {
            if (err) {
                console.log(err);
                reject(err);
            }
            SQLite3Driver.prototype.db.run(`INSERT
                                            INTO retailer
                                            VALUES (?, ?, ?, ?, ?, ?, ?)`, [json.retailer, json.subtext, json.online ? 1 : 0, json.lat, json.long, json.url], function (err) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    let retailerID = this.lastID;
                    console.log(`${json.retailer} was inserted with ID ${retailerID}`);
                    resolve(retailerID);
                }
            });
        });
    });
}

SQLite3Driver.prototype.updateLibrary = function updateLibrary(id, json) {
    return new Promise(function (resolve, reject) {
        let transaction = [];
        if (json['cost']) {
            transaction.push("cost = " + json['cost']);
        }
        if (json['new']) {
            transaction.push("new = " + json['new']);
        }
        if (json['retailerid'] >= 0) {
            transaction.push("retailerid = " + json['retailerid']);
        } else if (json['retailerid'] < 0) {
            transaction.push("retailerid = NULL");
        }
        if (json.hasOwnProperty('box')) {
            let value = json['box'] === true ? 1 : 0;
            transaction.push("box = " + value);
        }
        if (json.hasOwnProperty('manual')) {
            let value = json['manual'] === true ? 1 : 0;
            transaction.push("manual = " + value);
        }

        if (transaction.length == 0) {
            resolve();
        } else {
            let sql = transaction.join(', ');
            SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READWRITE, function (err) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                SQLite3Driver.prototype.db.run(`UPDATE library
                                                SET ${sql} WHERE id = ?`, [id], function (err) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        }
    });
}

SQLite3Driver.prototype.updateEdition = function updateEdition(id, json) {
    return new Promise(function (resolve, reject) {
        let transaction = [];
        if (json['edition']) {
            transaction.push("edition = '" + json['edition'] + "'");
        }
        if (json['upc']) {
            transaction.push("upc = '" + json['upc'] + "'");
        }
        if (json['msrp']) {
            transaction.push("msrp = " + json['msrp']);
        }

        if (transaction.length == 0) {
            resolve();
        } else {
            let sql = transaction.join(', ');
            SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READWRITE, function (err) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                SQLite3Driver.prototype.db.run(`UPDATE edition
                                                SET ${sql} WHERE id = ?`, [id], function (err) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        }
    });
}

SQLite3Driver.prototype.updateGame = function updateGame(id, json) {
    return new Promise(function (resolve, reject) {
        let transaction = [];
        if (json['title']) {
            transaction.push("title = '" + json['title'] + "'");
        }
        if (json['igdbURL']) {
            transaction.push("igdbURL = '" + json['igdbURL'] + "'");
        }

        if (transaction.length == 0) {
            resolve();
        } else {
            let sql = transaction.join(', ');
            SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READWRITE, function (err) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                SQLite3Driver.prototype.db.run(`UPDATE game
                                                SET ${sql} WHERE id = ?`, [id], function (err) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        }
    });
}

SQLite3Driver.prototype.addConsole = function addConsole(json) {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READWRITE, function (err) {
            if (err) {
                console.log(err);
                reject(err);
            }
            SQLite3Driver.prototype.db.run(`INSERT
                                            INTO platform
                                            VALUES (?, ?, ?)`, [`${json.name}`, `${json.brandID}`], function (err) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                let platformID = this.lastID;
                resolve(platformID);
            });
        });
    });
}

SQLite3Driver.prototype.addBrand = function addBrand(json) {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READWRITE, function (err) {
            if (err) {
                console.log(err);
                reject(err);
            }
            SQLite3Driver.prototype.db.run(`
                INSERT
                INTO brand
                VALUES (?, ?)`, [json.brand], function (err) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                let brandID = this.lastID;
                resolve(brandID);
            });
        });
    });
}

SQLite3Driver.prototype.lookupBrand = function lookupBrand(name) {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            let sql = `
                SELECT *
                FROM brand
                WHERE brand = ? `;
            SQLite3Driver.prototype.db.get(sql, [name], (err, row) => {
                if (err) {
                    reject(err);
                }
                if (row) {
                    resolve({"found": true, "id": row.id});
                } else {
                    resolve({"found": false});
                }
            });
        });
    });
}

SQLite3Driver.prototype.getRetailer = function getRetailer(id) {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            let sql = `
                SELECT *
                FROM retailer
                WHERE id = ?`;
            SQLite3Driver.prototype.db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                }
                resolve({
                    "id": row.id,
                    "retailer": row.retailer,
                    "subtext": row.subtext,
                    "online": row.online === 1,
                    "lat": row.lat,
                    "long": row.long,
                    "url": row.url
                });
            });
        });
    });
}

SQLite3Driver.prototype.getRetailers = function getRetailers(sortBy = 'retailer') {
    let parsedSortBy;
    switch (sortBy) {
        case 'retailer':
            parsedSortBy = "retailer.retailer";
            break;
        case 'online':
            parsedSortBy = "retailer.online";
            break;
        default:
            parsedSortBy = "retailer.retailer";
    }
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            }
            let sql = `SELECT *
                       FROM retailer
                       ORDER BY ${parsedSortBy} ASC`;
            SQLite3Driver.prototype.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                }
                let result = [];
                rows.forEach((row) => {
                    result.push({
                        "id": row.id,
                        "retailer": row.retailer,
                        "subtext": row.subtext,
                        "online": row.online === 1,
                        "lat": row.lat,
                        "long": row.long,
                        "url": row.url
                    });
                });
                resolve(result);
            });
        });
    });
}

SQLite3Driver.prototype.getPhysicalRetailers = function getPhysicalRetailers() {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            }
            let sql = `SELECT *
                       FROM retailer
                       WHERE online = 0`;
            SQLite3Driver.prototype.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    let result = [];
                    rows.forEach((row) => {
                        result.push({
                            "id": row.id,
                            "retailer": row.retailer,
                            "subtext": row.subtext,
                            "lat": row.lat,
                            "long": row.long,
                            "url": row.url
                        });
                    });
                    resolve(result);
                }
            });
        });
    });
}

SQLite3Driver.prototype.addWishlist = function addWishlist(json) {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READWRITE, function (err) {
            if (err) {
                console.log(err);
                reject(err);
            }
            SQLite3Driver.prototype.db.run(`INSERT
                                            INTO wishlist
                                            VALUES (?, ?)`, [`${json.editionID}`], function (err) {
                if (err) {
                    console.log(err);
                    reject(err);
                }

                let wishlistID = this.lastID;
                console.log(`A wishlist entry was inserted with ID ${wishlistID}`);
                resolve(wishlistID);
            });
        });
    });
}

SQLite3Driver.prototype.lookupByUPC = function lookupByUPC(upc) {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            }
            let sql = `SELECT game.*, platform.*, edition.*
                       FROM game,
                            platform,
                            edition
                       WHERE gameid = game.id
                         AND platform.id = platformid
                         AND edition.upc = ?
                       LIMIT 1`;
            // TODO: Change to get
            SQLite3Driver.prototype.db.all(sql, [upc], (err, rows) => {
                if (err) {
                    reject(err);
                }
                let result = {};
                try {
                    rows.forEach((row) => {
                        result = {
                            "title": row.title,
                            "platform": row.name,
                            "cost": row.cost,
                            "msrp": row.msrp,
                            "upc": row.upc,
                            "edition": row.edition
                        };
                    });
                } catch (e) {
                    reject(e);
                }
                resolve(result);
            });
        });
    });
}

SQLite3Driver.prototype.updateProgress = function updateProgress(libraryID = -1, progress = 0) {
    return new Promise(function (resolve, reject) {
        if (libraryID == -1) {
            reject({"msg": "Please supply a library ID"});
        }
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            let sql = `UPDATE library
                       SET progress = ?
                       WHERE id = ?`;
            SQLite3Driver.prototype.db.run(sql, [progress, libraryID], function (err) {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    });
}

SQLite3Driver.prototype.massImport = function massImport(json) {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            }
            let sql = `SELECT platform.*
                       FROM platform`;
            SQLite3Driver.prototype.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                }

                let platforms = {};

                rows.forEach((row) => {
                    platforms[row.name] = row.id;
                });

                let run = function (arr, i) {
                    if (arr.length == i) {
                        resolve();
                    } else {
                        arr[i]["platform"] = platforms[arr[i]["platform"]];
                        SQLite3Driver.prototype.lookupGame(arr[i]['title'], arr[i]['platform']).then(gameFound => {
                            if (gameFound['found'] === true) {
                                SQLite3Driver.prototype.lookupEdition(arr[i]['edition'], gameFound['id']).then(editionFound => {
                                    if (editionFound['found'] === true) {
                                        arr[i]['editionID'] = editionFound['id'];
                                        SQLite3Driver.prototype.addLibrary(arr[i]).then(libraryResult => {
                                            run(arr, i + 1);
                                        });
                                    } else {
                                        arr[i]['gameID'] = gameFound['id'];
                                        SQLite3Driver.prototype.addEdition(arr[i]).then(editionResult => {
                                            arr[i]['editionID'] = editionResult;
                                            SQLite3Driver.prototype.addLibrary(arr[i]).then(libraryResult => {
                                                run(arr, i + 1);
                                            });
                                        });
                                    }
                                }).catch(err => {
                                    console.log(err);
                                });
                            } else {
                                SQLite3Driver.prototype.addGame(arr[i]).then(result => {
                                    arr[i]['gameID'] = result;
                                    SQLite3Driver.prototype.addEdition(arr[i]).then(editionResult => {
                                        arr[i]['editionID'] = editionResult;
                                        SQLite3Driver.prototype.addLibrary(arr[i]).then(libraryResult => {
                                            run(arr, i + 1);
                                        });
                                    });
                                });
                            }
                        }).catch(err => {
                            console.log(err);
                        });
                    }
                }
                run(json, 0);
            });
        });
    });
}

SQLite3Driver.prototype.deleteGame = function deleteGame(id) {
    return new Promise(function (resolve, reject) {
        if (id == '*') {
            reject();
        }
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            let sql = `DELETE
                       FROM library
                       WHERE id = ?`;
            // TODO: Change to run
            SQLite3Driver.prototype.db.all(sql, [id], (err) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }

                resolve();
            });
        });
    });
}

SQLite3Driver.prototype.getLibrarySize = function getLibrarySize() {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            }
            let sql = `SELECT COUNT(id)
                       FROM library`;
            // TODO: Change to get
            SQLite3Driver.prototype.db.all(sql, [], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    let num = res[0]['COUNT(id)'];

                    resolve(num);
                }
            });
        });
    });
}

SQLite3Driver.prototype.getCurrentlyPlaying = function getCurrentlyPlaying(sortBy) {
    let parsedSortBy;
    switch (sortBy) {
        case 'title':
            parsedSortBy = "game.title";
            break;
        case 'platform':
            parsedSortBy = "platform.name ASC, game.title";
            break;
        case 'dateAdded':
            parsedSortBy = "library.timestamp ASC";
            break;
        case 'cost':
            parsedSortBy = "library.cost";
            break;
        case 'edition':
            parsedSortBy = "edition.edition";
            break;
        default:
            parsedSortBy = "game.title";
    }
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            }
            let sql = `SELECT library.id,
                               game.title,
                               platform.name,
                               library.timestamp,
                               library.cost,
                               edition.edition,
                               edition.gameid
                        FROM game,
                             platform,
                             edition,
                             library
                        WHERE editionid = edition.id
                          AND library.progress = 2
                          AND gameid = game.id
                          AND platform.id = platformid
                        ORDER BY ${parsedSortBy} ASC`;
            SQLite3Driver.prototype.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    let result = [];
                    rows.forEach((row) => {
                        result.push({
                            "id": row.id,
                            "title": row.title,
                            "platform": row.name,
                            "dateAdded": row.timestamp,
                            "cost": row.cost === null ? null : (Math.round(row.cost * 100) / 100).toFixed(2),
                            "edition": row.edition,
                            "gameID": row.gameid
                        });
                    });

                    resolve(result);
                }
            });
        });
    });
}

SQLite3Driver.prototype.getCompleted = function getCompleted(sortBy) {
    let parsedSortBy;
    switch (sortBy) {
        case 'title':
            parsedSortBy = "game.title";
            break;
        case 'platform':
            parsedSortBy = "platform.name ASC, game.title";
            break;
        case 'dateAdded':
            parsedSortBy = "library.timestamp ASC";
            break;
        case 'cost':
            parsedSortBy = "library.cost";
            break;
        case 'edition':
            parsedSortBy = "edition.edition";
            break;
        default:
            parsedSortBy = "game.title";
    }
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            }
            let sql = `SELECT library.id,
                               game.title,
                               platform.name,
                               library.timestamp,
                               library.cost,
                               edition.edition,
                               edition.gameid
                        FROM game,
                             platform,
                             edition,
                             library
                        WHERE editionid = edition.id
                          AND library.progress = 3
                          AND gameid = game.id
                          AND platform.id = platformid
                        ORDER BY ${parsedSortBy} ASC`;
            SQLite3Driver.prototype.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                }
                let result = [];
                rows.forEach((row) => {
                    result.push({
                        "id": row.id,
                        "title": row.title,
                        "platform": row.name,
                        "dateAdded": row.timestamp,
                        "cost": row.cost === null ? null : (Math.round(row.cost * 100) / 100).toFixed(2),
                        "edition": row.edition,
                        "gameID": row.gameid
                    });
                });

                resolve(result);
            });
        });
    });
}

SQLite3Driver.prototype.getFigureSize = function getFigureSize() {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            }
            let sql = `SELECT COUNT(id)
                       FROM figure`;
            // TODO: Change to get
            SQLite3Driver.prototype.db.all(sql, [], (err, res) => {
                if (err) {
                    reject(err);
                }

                let num = res[0]['COUNT(id)'];
                resolve(num);
            });
        });
    });
}

SQLite3Driver.prototype.getWishlistSize = function getWishlistSize() {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            }
            let sql = `SELECT COUNT(id)
                       FROM wishlist`;
            // TODO: Change to get
            SQLite3Driver.prototype.db.all(sql, [], (err, res) => {
                if (err) {
                    reject(err);
                }

                let num = res[0]['COUNT(id)'];


                resolve(num);
            });
        });
    });
}

SQLite3Driver.prototype.lookupGame = function lookupGame(title, platformID) {
    return new Promise(function (resolve, reject) {
        if (title.includes("’") || title.includes("'")) { // TODO: Find a better way to do this
            resolve({"found": false});
        }
        if (platformID == undefined) {
            platformID = '\'undefined\'';
        }
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            let sql = `
                SELECT *
                FROM game
                WHERE title = ?
                  AND platformid = ? `;
            // TODO: Change to get
            SQLite3Driver.prototype.db.all(sql, [title, platformID], (err, res) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }

                if (res == null || res.length < 1) {
                    resolve({"found": false});
                } else {
                    resolve({"found": true, "id": res[0].id, "igdb": res[0]['igdbURL']});
                }
            });
        });
    });
}

SQLite3Driver.prototype.lookupEdition = function lookupEdition(edition, gameID) {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            if (gameID == undefined) {
                gameID = '\'undefined\'';
            }
            let sql = `SELECT *
                       FROM edition
                       WHERE edition = ?
                         AND gameid = ? `;
            // TODO: Change to get
            SQLite3Driver.prototype.db.all(sql, [edition, gameID], (err, res) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }

                if (res == null || res.length < 1) {
                    resolve({"found": false});
                } else {
                    resolve({"found": true, "id": res[0].id});
                }
            });
        });
    });
}

SQLite3Driver.prototype.lookupAmiibo = function lookupAmiibo(name, seriesID) {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            }
            let sql = `SELECT *
                       FROM amiibo
                       WHERE title = ?
                         AND seriesid = ? `;
            SQLite3Driver.prototype.db.all(sql, [name, seriesID], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    if (res == null || res.length < 1) {
                        resolve({"found": false});
                    } else {
                        resolve({"found": true, "id": res[0].id});
                    }
                }
            });
        });
    });
}

SQLite3Driver.prototype.countByPlatform = function countByPlatform() {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            }
            let sql = `SELECT platform.name, COUNT(library.id)
                       FROM library,
                            edition,
                            game,
                            platform
                       WHERE library.editionid = edition.id
                         AND edition.gameid = game.id
                         AND game.platformid = platform.id
                       GROUP BY platform.id
                       ORDER BY COUNT(library.id) DESC`;
            SQLite3Driver.prototype.db.all(sql, [], (err, res) => {
                if (err) {
                    reject(err);
                }

                resolve(res);
            });
        });
    });
}

SQLite3Driver.prototype.countByProgress = function countByProgress() {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            }
            let sql = `SELECT library.progress, COUNT(library.id)
                       FROM library
                       GROUP BY library.progress
                       ORDER BY library.progress DESC`;
            SQLite3Driver.prototype.db.all(sql, [], (err, res) => {
                if (err) {
                    reject(err);
                }

                resolve(res);
            });
        });
    });
}

SQLite3Driver.prototype.countByDateAdded = function countByDateAdded() {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            }
            let sql = `SELECT library.timestamp, COUNT(library.id)
                       FROM library
                       GROUP BY library.timestamp
                       ORDER BY library.timestamp ASC`;
            SQLite3Driver.prototype.db.all(sql, [], (err, res) => {
                if (err) {
                    reject(err);
                }

                resolve(res);
            });
        });
    });
}

SQLite3Driver.prototype.countFiguresByDateAdded = function countFiguresByDateAdded() {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            }
            let sql = `SELECT figure.timestamp, COUNT(figure.id)
                       FROM figure
                       GROUP BY figure.timestamp
                       ORDER BY figure.timestamp ASC`;
            SQLite3Driver.prototype.db.all(sql, [], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    });
}

SQLite3Driver.prototype.getSeries = function getSeries() {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            }
            let sql = `SELECT *
                       FROM series
                       ORDER BY series ASC`;
            SQLite3Driver.prototype.db.all(sql, [], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    });
}

SQLite3Driver.prototype.countByCondition = function countByCondition() {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            }
            let sql = `SELECT library.new, COUNT(library.id)
                       FROM library
                       GROUP BY library.new
                       ORDER BY library.new DESC`;
            SQLite3Driver.prototype.db.all(sql, [], (err, res) => {
                if (err) {
                    reject(err);
                }

                resolve(res);
            });
        });
    });
}

SQLite3Driver.prototype.countByBrand = function countByBrand() {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            }
            let sql = `SELECT brand.brand, COUNT(library.id)
                       FROM library,
                            edition,
                            game,
                            platform,
                            brand
                       WHERE library.editionid = edition.id
                         AND edition.gameid = game.id
                         AND game.platformid = platform.id
                         AND platform.brandid = brand.id
                       GROUP BY brand.id
                       ORDER BY COUNT(library.id) DESC`;
            SQLite3Driver.prototype.db.all(sql, [], (err, res) => {
                if (err) {
                    reject(err);
                }

                resolve(res);
            });
        });
    });
}

SQLite3Driver.prototype.getGamesWithoutLibrary = function getGamesWithoutLibrary() {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            }
            let sql = `SELECT g.id, g.title
                       FROM game AS g,
                            edition AS e
                       WHERE e.gameid = g.id
                         AND NOT EXISTS
                           (
                               SELECT id
                               FROM library AS l
                               WHERE e.id = l.editionid
                           )`;
            SQLite3Driver.prototype.db.all(sql, [], (err, res) => {
                if (err) {
                    reject(err);
                }

                resolve(res);
            });
        });
    });
}

SQLite3Driver.prototype.getGamesWithoutIGDBMetadata = function getGamesWithoutIGDBMetadata() {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            }
            let sql = `SELECT id, title
                       FROM game
                       WHERE igdbURL IS NULL`;
            SQLite3Driver.prototype.db.all(sql, [], (err, res) => {
                if (err) {
                    reject(err);
                }

                resolve(res);
            });
        });
    });
}

SQLite3Driver.prototype.getEditionsWithoutUPC = function getEditionsWithoutUPC() {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            }
            let sql = `SELECT edition.id, game.title, edition.edition
                       FROM edition,
                            game
                       WHERE edition.gameid = game.id
                         AND edition.upc IS NULL`;
            SQLite3Driver.prototype.db.all(sql, [], (err, res) => {
                if (err) {
                    reject(err);
                }

                resolve(res);
            });
        });
    });
}

SQLite3Driver.prototype.getEditionsWithoutMSRP = function getEditionsWithoutMSRP() {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            }
            let sql = `SELECT edition.id, game.title, edition.edition
                       FROM edition,
                            game
                       WHERE edition.gameid = game.id
                         AND edition.msrp IS NULL`;
            SQLite3Driver.prototype.db.all(sql, [], (err, res) => {
                if (err) {
                    reject(err);
                }

                resolve(res);
            });
        });
    });
}

SQLite3Driver.prototype.getLibraryEntriesWithoutCost = function getLibraryEntriesWithoutCost() {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            }
            let sql = `SELECT library.id, game.title, edition.edition
                       FROM edition,
                            game,
                            library
                       WHERE edition.gameid = game.id
                         AND library.editionid = edition.id
                         AND library.cost IS NULL`;
            SQLite3Driver.prototype.db.all(sql, [], (err, res) => {
                if (err) {
                    reject(err);
                }

                resolve(res);
            });
        });
    });
}

SQLite3Driver.prototype.getLibraryEntriesWithoutDateAdded = function getLibraryEntriesWithoutDateAdded() {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            }
            let sql = `SELECT library.id, game.title, edition.edition
                       FROM edition,
                            game,
                            library
                       WHERE edition.gameid = game.id
                         AND library.editionid = edition.id
                         AND library.timestamp IS NULL`;
            SQLite3Driver.prototype.db.all(sql, [], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    });
}

SQLite3Driver.prototype.getFiguresWithoutDateAdded = function getFiguresWithoutDateAdded() {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            }
            let sql = `SELECT figure.id, amiibo.title, series.series
                       FROM figure,
                            amiibo,
                            series
                       WHERE amiibo.seriesid = series.id
                         AND figure.amiiboid = amiibo.id
                         AND figure.timestamp IS NULL`;
            SQLite3Driver.prototype.db.all(sql, [], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    });
}

SQLite3Driver.prototype.getLibraryEntriesFromRetailer = function getLibraryEntriesFromRetailer(id) {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            }
            let sql = `SELECT library.id, game.title, edition.edition
                       FROM library,
                            game,
                            edition,
                            retailer
                       WHERE library.retailerid = ?
                         AND retailer.id = library.retailerid
                         AND library.editionid = edition.id
                         AND edition.gameid = game.id
                       ORDER BY game.title ASC`;
            SQLite3Driver.prototype.db.all(sql, [id], (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res);
            });
        });
    });
}

SQLite3Driver.prototype.getFiguresFromRetailer = function getFiguresFromRetailer(id) {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            }
            let sql = `SELECT figure.id, amiibo.title, series.series
                       FROM figure,
                            amiibo,
                            series,
                            retailer
                       WHERE figure.retailerid = ?
                         AND retailer.id = figure.retailerid
                         AND figure.amiiboid = amiibo.id
                         AND amiibo.seriesid = series.id
                       ORDER BY amiibo.title ASC`;
            SQLite3Driver.prototype.db.all(sql, [id], (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res);
            });
        });
    });
}

SQLite3Driver.prototype.getLibraryEntriesWithoutRetailer = function getLibraryEntriesWithoutRetailer() {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            }
            let sql = `SELECT library.id, game.title, edition.edition
                       FROM edition,
                            game,
                            library
                       WHERE edition.gameid = game.id
                         AND library.editionid = edition.id
                         AND library.retailerid IS NULL`;
            SQLite3Driver.prototype.db.all(sql, [], (err, res) => {
                if (err) {
                    reject(err);
                }

                resolve(res);
            });
        });
    });
}

SQLite3Driver.prototype.createBackup = function createBackup() {
    return new Promise(function (resolve, reject) {
        let timestamp = new Date(Date.now()).toISOString();
        timestamp = timestamp.split('.')[0];
        timestamp = timestamp.split(':').join('-');
        let destFileName = "backup-" + timestamp + ".pixelshelf";
        fs.copyFile(SQLite3Driver.prototype.dbName, "./models/backups/" + destFileName, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(destFileName);
            }
        });
    });
}

SQLite3Driver.prototype.getDBStats = function getDBStats() {
    return new Promise(function (resolve, reject) {
        fs.stat(SQLite3Driver.prototype.dbName, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

SQLite3Driver.prototype.checkStatus = function checkStatus() {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}

module.exports = SQLite3Driver;