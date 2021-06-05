const sqlite3 = require('sqlite3').verbose();

function SQLite3Driver() {
    SQLite3Driver.prototype.dbName = './models/pixelshelf.db';
}

SQLite3Driver.prototype.getLibrary = function getLibrary() {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                reject(err);
            }
            let sql = 'SELECT library.id, game.id, game.title, platform.name, library.month, library.day, library.year, library.cost, edition.edition FROM game, platform, edition, library WHERE editionid = edition.id AND gameid = game.id AND platform.id = platformid';
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
                        "dateAdded": row.month + '-' + row.day + '-' + row.year,
                        "cost": row.cost,
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
            let sql = 'SELECT platform.name, platform.id FROM platform';
            SQLite3Driver.prototype.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                }
                let result = [];
                rows.forEach((row) => {
                    result.push({
                        "id": row.id,
                        "platform": row.name,
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
                        result = {
                            "title": row.title,
                            "platform": row.name,
                            "cost": row.cost,
                            "msrp": row.msrp,
                            "upc": row.upc,
                            "edition": row.edition,
                            "new": row.new == 1,
                            "date": row.year + '-' + row.month + '-' + row.day
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
                                            VALUES (?, ?, ?)`, [`${json.title}`, `${json.platform}`], function (err) {
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

SQLite3Driver.prototype.connect = function connect() {
    SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Connected to SQLite3 DB');
    });
}

module.exports = SQLite3Driver;