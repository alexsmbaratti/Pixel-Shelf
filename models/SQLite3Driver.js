const sqlite3 = require('sqlite3').verbose();

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
            parsedSortBy = "library.year ASC, library.month ASC, library.day ASC";
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
                              library.month,
                              library.day,
                              library.year,
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
                }
                let result = [];
                rows.forEach((row) => {
                    let date = row.month + '-' + row.day + '-' + row.year;
                    if (row.month == 'null' || row.day == 'null' || row.year == 'null') {
                        date = 'Unknown';
                    }
                    result.push({
                        "id": row.id,
                        "title": row.title,
                        "platform": row.name,
                        "dateAdded": date,
                        "cost": (Math.round(row.cost * 100) / 100).toFixed(2),
                        "edition": row.edition
                    });
                });

                resolve(result);
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
            parsedSortBy = "library.year ASC, library.month ASC, library.day";
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
                              library.month,
                              library.day,
                              library.year,
                              library.cost,
                              edition.edition
                       FROM game,
                            platform,
                            edition,
                            library
                       WHERE editionid = edition.id
                         AND game.progress = 1
                         AND gameid = game.id
                         AND platform.id = platformid
                       ORDER BY ${parsedSortBy} ASC`;
            SQLite3Driver.prototype.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                }
                let result = [];
                rows.forEach((row) => {
                    let date = row.month + '-' + row.day + '-' + row.year;
                    if (row.month == 'null' || row.day == 'null' || row.year == 'null') {
                        date = 'Unknown';
                    }
                    result.push({
                        "id": row.id,
                        "title": row.title,
                        "platform": row.name,
                        "dateAdded": date,
                        "cost": (Math.round(row.cost * 100) / 100).toFixed(2),
                        "edition": row.edition
                    });
                });

                resolve(result);
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
                }
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
                }
                let result = [];
                rows.forEach((row) => {
                    result.push({
                        "id": row.id,
                        "name": row.name,
                        "brand": row.brand
                    });
                });

                resolve(result);
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
                    "igdbURL": igdbURL,
                    "progress": row.progress
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
                        let month;
                        if (row.month < 10) {
                            month = '0' + row.month;
                        } else {
                            month = row.month;
                        }

                        let day;
                        if (row.day < 10) {
                            day = '0' + row.day;
                        } else {
                            day = row.day;
                        }

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
                            "date": row.year + '-' + month + '-' + day,
                            "gameID": row.gameid,
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
                VALUES (?, ?, ?, ?, ?)`, [json.title, json.platform, json['igdb-url'], 0], function (err) {
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
                }
                let editionID = this.lastID;
                console.log(`${json.edition} was inserted with ID ${editionID}`);
                resolve(editionID);
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
                                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [json.cost, json.month, json.day, json.year, json.editionID, json.retailerID, json['condition'] ? 1 : 0, json.box ? 1 : 0, json.manual ? 1 : 0], function (err) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                let libraryID = this.lastID;
                console.log(`A library entry was inserted with ID ${libraryID}`);
                resolve(libraryID);
            });
        });
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

SQLite3Driver.prototype.updateProgress = function updateProgress(gameID = -1, progress = 0) {
    return new Promise(function (resolve, reject) {
        if (gameID == -1) {
            reject({"msg": "Please supply a game ID"});
        }
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            let sql = `UPDATE
                           game
                       SET progress = ?
                       WHERE id = ? `;
            SQLite3Driver.prototype.db.run(sql, [progress, gameID], function (err) {
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
                }

                let num = res[0]['COUNT(id)'];

                resolve(num);
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
            parsedSortBy = "library.year ASC, library.month ASC, library.day";
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
            let sql = `SELECT game.id,
                               game.title,
                               platform.name,
                               library.month,
                               library.day,
                               library.year,
                               library.cost,
                               edition.edition
                        FROM game,
                             platform,
                             edition,
                             library
                        WHERE editionid = edition.id
                          AND game.progress = 2
                          AND gameid = game.id
                          AND platform.id = platformid
                        ORDER BY ${parsedSortBy} ASC`;
            SQLite3Driver.prototype.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                }
                let result = [];
                rows.forEach((row) => {
                    let date = row.month + '-' + row.day + '-' + row.year;
                    if (row.month == 'null' || row.day == 'null' || row.year == 'null') {
                        date = 'Unknown';
                    }
                    result.push({
                        "id": row.id,
                        "title": row.title,
                        "platform": row.name,
                        "dateAdded": date,
                        "cost": (Math.round(row.cost * 100) / 100).toFixed(2),
                        "edition": row.edition
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

SQLite3Driver.prototype.exportDB = function exportDB() {
    return new Promise(function (resolve, reject) {
        reject("Not implemented!");
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