const sqlite3 = require('sqlite3').verbose();

function SQLite3Driver() {
    SQLite3Driver.prototype.dbName = './models/db/pixelshelf.db';
}

SQLite3Driver.prototype.getLibrary = function getLibrary(sortBy) {
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
            let sql = `SELECT library.id, game.id, game.title, platform.name, library.month, library.day, library.year, library.cost, edition.edition FROM game, platform, edition, library WHERE editionid = edition.id AND gameid = game.id AND platform.id = platformid ORDER BY ${parsedSortBy} ASC`;
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
                SQLite3Driver.prototype.db.close();
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
            let sql = 'SELECT platform.*, brand.brand FROM platform, brand WHERE platform.brandid = brand.id ORDER BY platform.name ASC';
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
                SQLite3Driver.prototype.db.close();
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
            let sql = 'SELECT game.*, platform.*, edition.*, library.* FROM library, game, platform, edition WHERE editionid = edition.id AND gameid = game.id AND platform.id = platformid AND library.id = ' + id + ' LIMIT 1';
            SQLite3Driver.prototype.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                }
                let result = {};
                try {
                    rows.forEach((row) => {
                        console.log(row)

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

                        result = {
                            "title": row.title,
                            "platform": row.name,
                            "cost": row.cost,
                            "msrp": row.msrp,
                            "upc": row.upc,
                            "edition": row.edition,
                            "new": row.new == 1,
                            "igdbURL": row.igdbURL.length == 0 ? null : row.igdbURL,
                            "date": row.year + '-' + month + '-' + day
                        };
                    });
                } catch (e) {
                    SQLite3Driver.prototype.db.close();
                    reject(e);
                }
                SQLite3Driver.prototype.db.close();
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
            SQLite3Driver.prototype.db.run(`INSERT INTO game
                                            VALUES (?, ?, ?, ?)`, [`${json.title}`, `${json.platform}`, `${json['igdb-url']}`], function (err) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                let gameID = this.lastID;
                console.log(`${json.title} was inserted with ID ${gameID}`);
                SQLite3Driver.prototype.db.run(`INSERT INTO edition
                                                VALUES (?, ?, ?, ?, ?)`, [`${json.edition}`, `${json.upc}`, `${json.msrp}`, `${gameID}`], function (err) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    let editionID = this.lastID;
                    console.log(`${json.edition} was inserted with ID ${editionID}`);
                    SQLite3Driver.prototype.db.run(`INSERT INTO library
                                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [`${json.cost}`, `${json.month}`, `${json.day}`, `${json.year}`, `${editionID}`, null], function (err) {
                        if (err) {
                            console.log(err);
                            reject(err);
                        }
                        let libraryID = this.lastID;
                        console.log(`${json.title} was added to library with ID ${libraryID}`);
                        SQLite3Driver.prototype.db.close();
                        resolve(libraryID);
                    });
                });
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
            let sql = 'SELECT game.*, platform.*, edition.* FROM game, platform, edition WHERE gameid = game.id AND platform.id = platformid AND edition.upc = ' + upc + ' LIMIT 1';
            SQLite3Driver.prototype.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                }
                let result = {};
                try {
                    rows.forEach((row) => {
                        console.log(row)
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
                    SQLite3Driver.prototype.db.close();
                    reject(e);
                }
                SQLite3Driver.prototype.db.close();
                resolve(result);
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
            let sql = 'SELECT platform.* FROM platform';
            SQLite3Driver.prototype.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                }

                let platforms = {};

                rows.forEach((row) => {
                    platforms[row.name] = row.id;
                });
                console.log(platforms);
                SQLite3Driver.prototype.db.close();

                let run = function (arr, i) {
                    if (arr.length == i) {
                        resolve();
                    } else {
                        arr[i]["platform"] = platforms[arr[i]["platform"]];
                        console.log(arr[i]);
                        SQLite3Driver.prototype.addGame(arr[i]).then(result => {
                            run(arr, i + 1);
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
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            let sql = 'DELETE FROM library WHERE id = ' + id;
            SQLite3Driver.prototype.db.all(sql, [], (err) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                SQLite3Driver.prototype.db.close();
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
            let sql = 'SELECT COUNT(title) FROM game';
            SQLite3Driver.prototype.db.all(sql, [], (err, res) => {
                if (err) {
                    reject(err);
                }

                let num = res[0]['COUNT(title)'];

                SQLite3Driver.prototype.db.close();
                resolve(num);
            });
        });
    });
}

SQLite3Driver.prototype.connect = function connect() {
    SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Connected to SQLite3 DB');
    });
}

module.exports = SQLite3Driver;