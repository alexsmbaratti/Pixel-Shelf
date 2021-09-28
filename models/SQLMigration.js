const sqlite3 = require('sqlite3').verbose();

const dbName = 'PATH/TO/DB';

let db = new sqlite3.Database(dbName, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.log(err);
    } else {
        createTable(db, `CREATE TABLE newgame
                         (
                             title      TEXT NOT NULL,
                             platformid INTEGER,
                             igdbURL    TEXT,
                             id         INTEGER PRIMARY KEY AUTOINCREMENT,
                             FOREIGN KEY (platformid) REFERENCES platform (id) ON DELETE CASCADE,
                             FOREIGN KEY (igdbURL) REFERENCES igdb (igdbURL) ON DELETE SET NULL
                         )`, 'newgame')
            .then(() => {
                createTable(db, `CREATE TABLE newedition
                                 (
                                     edition    TEXT    NOT NULL,
                                     upc        TEXT,
                                     msrp       REAL,
                                     gameid     INTEGER,
                                     digital    INTEGER NOT NULL,
                                     currencyid TEXT,
                                     region     INTEGER,
                                     id         INTEGER PRIMARY KEY AUTOINCREMENT,
                                     FOREIGN KEY (gameid) REFERENCES game (id) ON DELETE CASCADE,
                                     FOREIGN KEY (currencyid) REFERENCES currency (code) ON DELETE SET NULL,
                                     FOREIGN KEY (region) REFERENCES region (id) ON DELETE SET NULL
                                 )`, 'newedition')
                    .then(() => {
                        createTable(db, `CREATE TABLE newlibrary
                                         (
                                             cost       REAL,
                                             timestamp  TEXT,
                                             editionid  INTEGER,
                                             retailerid INTEGER,
                                             new        INTEGER NOT NULL,
                                             box        INTEGER NOT NULL,
                                             manual     INTEGER NOT NULL,
                                             progress   INTEGER NOT NULL,
                                             gift       INTEGER NOT NULL,
                                             currencyid TEXT,
                                             private    INTEGER NOT NULL,
                                             notes      TEXT,
                                             id         INTEGER PRIMARY KEY AUTOINCREMENT,
                                             FOREIGN KEY (editionid) REFERENCES edition (id) ON DELETE CASCADE,
                                             FOREIGN KEY (retailerid) REFERENCES retailer (id) ON DELETE SET NULL,
                                             FOREIGN KEY (currencyid) REFERENCES currency (code) ON DELETE SET NULL
                                         )`, 'newlibrary')
                            .then(() => {
                                createTable(db, `CREATE TABLE newamiibo
                                                 (
                                                     title      TEXT NOT NULL,
                                                     seriesid   INTEGER,
                                                     msrp       REAL,
                                                     type       INTEGER,
                                                     currencyid TEXT,
                                                     id         INTEGER PRIMARY KEY AUTOINCREMENT,
                                                     FOREIGN KEY (seriesid) REFERENCES series (id) ON DELETE CASCADE,
                                                     FOREIGN KEY (currencyid) REFERENCES currency (code) ON DELETE SET NULL
                                                 )`, 'newamiibo')
                                    .then(() => {
                                        createTable(db, `CREATE TABLE newfigure
                                                         (
                                                             cost       REAL,
                                                             timestamp  TEXT,
                                                             retailerid INTEGER,
                                                             new        INTEGER NOT NULL,
                                                             inbox      INTEGER NOT NULL,
                                                             amiiboid   INTEGER,
                                                             region     INTEGER,
                                                             gift       INTEGER NOT NULL,
                                                             currencyid TEXT,
                                                             notes      TEXT,
                                                             id         INTEGER PRIMARY KEY AUTOINCREMENT,
                                                             FOREIGN KEY (retailerid) REFERENCES retailer (id) ON DELETE SET NULL,
                                                             FOREIGN KEY (amiiboid) REFERENCES amiibo (id) ON DELETE CASCADE,
                                                             FOREIGN KEY (currencyid) REFERENCES currency (code) ON DELETE SET NULL,
                                                             FOREIGN KEY (region) REFERENCES region (id) ON DELETE SET NULL
                                                         )`, 'newfigure')
                                            .then(() => {
                                                createTable(db, `CREATE TABLE igdb
                                                                 (
                                                                     description TEXT,
                                                                     coverURL    TEXT,
                                                                     releasedate TEXT,
                                                                     igdbURL     TEXT PRIMARY KEY
                                                                 )`, 'igdb')
                                                    .then(() => {
                                                        createTable(db, `CREATE TABLE rating
                                                                         (
                                                                             ratingorg TEXT,
                                                                             id        INTEGER PRIMARY KEY AUTOINCREMENT
                                                                         )`, 'rating')
                                                            .then(() => {
                                                                createTable(db, `CREATE TABLE genre
                                                                                 (
                                                                                     description TEXT,
                                                                                     id          INTEGER PRIMARY KEY AUTOINCREMENT
                                                                                 )`, 'genre')
                                                                    .then(() => {
                                                                        createTable(db, `CREATE TABLE hasagenre
                                                                                         (
                                                                                             igdbURL TEXT,
                                                                                             genreid INTEGER,
                                                                                             PRIMARY KEY (igdbURL, genreid),
                                                                                             FOREIGN KEY (igdbURL) REFERENCES igdb (igdbURL) ON DELETE CASCADE,
                                                                                             FOREIGN KEY (genreid) REFERENCES genre (id) ON DELETE CASCADE
                                                                                         )`, 'hasagenre')
                                                                            .then(() => {
                                                                                createTable(db, `CREATE TABLE hasarating
                                                                                                 (
                                                                                                     igdbURL  TEXT,
                                                                                                     ratingid INTEGER,
                                                                                                     PRIMARY KEY (igdbURL, ratingid),
                                                                                                     FOREIGN KEY (igdbURL) REFERENCES igdb (igdbURL) ON DELETE CASCADE,
                                                                                                     FOREIGN KEY (ratingid) REFERENCES rating (id) ON DELETE CASCADE
                                                                                                 )`, 'hasarating')
                                                                                    .then(() => {
                                                                                        createTable(db, `CREATE TABLE currency
                                                                                                         (
                                                                                                             symbol TEXT,
                                                                                                             label  TEXT,
                                                                                                             code   TEXT UNIQUE PRIMARY KEY
                                                                                                         )`, 'currency')
                                                                                            .then(() => {
                                                                                                createTable(db, `CREATE TABLE region
                                                                                                                 (
                                                                                                                     name TEXT NOT NULL,
                                                                                                                     id   INTEGER PRIMARY KEY AUTOINCREMENT
                                                                                                                 )`, 'region')
                                                                                                    .then(() => {
                                                                                                        insertRow(db, `INSERT INTO currency
                                                                                                                       VALUES ('$', 'United States dollar', 'USD')`)
                                                                                                            .then(() => {
                                                                                                                insertRow(db, `INSERT INTO currency
                                                                                                                               VALUES ('¥', 'Japanese yen', 'JPY')`)
                                                                                                                    .then(() => {
                                                                                                                        insertRow(db, `INSERT INTO region
                                                                                                                                       VALUES ('North America', 1)`)
                                                                                                                            .then(() => {
                                                                                                                                insertRow(db, `INSERT INTO region
                                                                                                                                               VALUES ('Europe', 2)`)
                                                                                                                                    .then(() => {
                                                                                                                                        insertRow(db, `INSERT INTO region
                                                                                                                                                       VALUES ('Japan', 3)`)
                                                                                                                                            .then(() => {
                                                                                                                                                db.each(`SELECT *
                                                                                                                                                         FROM library`, [], (err, row) => {
                                                                                                                                                    if (err) {
                                                                                                                                                        console.log(err);
                                                                                                                                                        throw err;
                                                                                                                                                    } else {
                                                                                                                                                        db.run(`INSERT
                                                                                                                                                                INTO newlibrary
                                                                                                                                                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [row['cost'], row['timestamp'], row['editionid'], row['retailerid'], row['new'], row['box'], row['manual'], row['progress'], 0, 'USD', 0, null, row['id']], function (err) {
                                                                                                                                                            if (err) {
                                                                                                                                                                console.log(err);
                                                                                                                                                            } else {
                                                                                                                                                                let libraryID = this.lastID;
                                                                                                                                                                console.log(`INSERT A row was inserted into library table with ID ${libraryID}`);
                                                                                                                                                            }
                                                                                                                                                        });
                                                                                                                                                    }
                                                                                                                                                });
                                                                                                                                                db.each(`SELECT *
                                                                                                                                                         FROM game`, [], (err, row) => {
                                                                                                                                                    if (err) {
                                                                                                                                                        console.log(err);
                                                                                                                                                        throw err;
                                                                                                                                                    } else {
                                                                                                                                                        db.run(`INSERT
                                                                                                                                                                INTO newgame
                                                                                                                                                                VALUES (?, ?, ?, ?)`, [row['title'], row['platformid'], row['igdbURL'], row['id']], function (err) {
                                                                                                                                                            if (err) {
                                                                                                                                                                console.log(err);
                                                                                                                                                            } else {
                                                                                                                                                                let gameID = this.lastID;
                                                                                                                                                                console.log(`INSERT A row was inserted into game table with ID ${gameID}`);
                                                                                                                                                            }
                                                                                                                                                        });
                                                                                                                                                    }
                                                                                                                                                });
                                                                                                                                                db.each(`SELECT *
                                                                                                                                                         FROM edition`, [], (err, row) => {
                                                                                                                                                    if (err) {
                                                                                                                                                        console.log(err);
                                                                                                                                                        throw err;
                                                                                                                                                    } else {
                                                                                                                                                        db.run(`INSERT
                                                                                                                                                                INTO newedition
                                                                                                                                                                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [row['edition'], row['upc'], row['msrp'], row['gameid'], 0, 'USD', 1, row['id']], function (err) {
                                                                                                                                                            if (err) {
                                                                                                                                                                console.log(err);
                                                                                                                                                            } else {
                                                                                                                                                                let editionID = this.lastID;
                                                                                                                                                                console.log(`INSERT A row was inserted into edition table with ID ${editionID}`);
                                                                                                                                                            }
                                                                                                                                                        });
                                                                                                                                                    }
                                                                                                                                                });
                                                                                                                                                db.each(`SELECT *
                                                                                                                                                         FROM amiibo`, [], (err, row) => {
                                                                                                                                                    if (err) {
                                                                                                                                                        console.log(err);
                                                                                                                                                        throw err;
                                                                                                                                                    } else {
                                                                                                                                                        db.run(`INSERT
                                                                                                                                                                INTO newamiibo
                                                                                                                                                                VALUES (?, ?, ?, ?, ?, ?)`, [row['title'], row['seriesid'], row['msrp'], row['type'], 'USD', row['id']], function (err) {
                                                                                                                                                            if (err) {
                                                                                                                                                                console.log(err);
                                                                                                                                                            } else {
                                                                                                                                                                let editionID = this.lastID;
                                                                                                                                                                console.log(`INSERT A row was inserted into amiibo table with ID ${editionID}`);
                                                                                                                                                            }
                                                                                                                                                        });
                                                                                                                                                    }
                                                                                                                                                });
                                                                                                                                                db.each(`SELECT *
                                                                                                                                                         FROM figure`, [], (err, row) => {
                                                                                                                                                    if (err) {
                                                                                                                                                        console.log(err);
                                                                                                                                                        throw err;
                                                                                                                                                    } else {
                                                                                                                                                        db.run(`INSERT
                                                                                                                                                                INTO newfigure
                                                                                                                                                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [row['cost'], row['timestamp'], row['retailerid'], row['new'], row['inbox'], row['amiiboid'], 1, 0, 'USD', null, row['id']], function (err) {
                                                                                                                                                            if (err) {
                                                                                                                                                                console.log(err);
                                                                                                                                                            } else {
                                                                                                                                                                let editionID = this.lastID;
                                                                                                                                                                console.log(`INSERT A row was inserted into amiibo table with ID ${editionID}`);
                                                                                                                                                            }
                                                                                                                                                        });
                                                                                                                                                    }
                                                                                                                                                });
                                                                                                                                            }).catch(err => {

                                                                                                                                        });
                                                                                                                                    }).catch(err => {

                                                                                                                                });
                                                                                                                            }).catch(err => {

                                                                                                                        });
                                                                                                                    }).catch(err => {

                                                                                                                });
                                                                                                            }).catch(err => {

                                                                                                        });
                                                                                                    }).catch(err => {

                                                                                                });
                                                                                            }).catch(err => {

                                                                                        });
                                                                                    }).catch(err => {

                                                                                });
                                                                            }).catch(err => {

                                                                        });
                                                                    }).catch(err => {

                                                                });
                                                            }).catch(err => {

                                                        });
                                                    }).catch(err => {

                                                });
                                            }).catch(err => {

                                        });
                                    }).catch(err => {

                                });
                            }).catch(err => {

                        });
                    }).catch(err => {

                });
            }).catch(err => {

        });
    }
});

function createTable(db, sql, tableName) {
    return new Promise(function (resolve, reject) {
        db.run(sql, [], function (err) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log(`CREATE New table ${tableName} created`);
                resolve();
            }
        });
    });
}

function insertRow(db, sql) {
    return new Promise(function (resolve, reject) {
        db.run(sql, [], function (err) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log(`INSERT New row created`);
                resolve();
            }
        });
    });
}

function dropTable(db, table) {
    return new Promise(function (resolve, reject) {
        db.run(`DROP TABLE ${table}`, [], function (err) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log(`DROP ${table} table dropped`);
                resolve();
            }
        });
    });
}

function renameTable(db, table, newTable) {
    return new Promise(function (resolve, reject) {
        db.run(`ALTER TABLE ${table} RENAME TO ${newTable}`, [], function (err) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log(`ALTER ${table} table renamed to ${newTable}`);
                resolve();
            }
        });
    });
}

function cleanup(db) {
    dropTable(db, 'figure').then(r => {
        renameTable(db, 'newfigure', 'figure');
    });
    dropTable(db, 'edition').then(r => {
        renameTable(db, 'newedition', 'edition');
    });
    dropTable(db, 'game').then(r => {
        renameTable(db, 'newgame', 'game');
    });
    dropTable(db, 'library').then(r => {
        renameTable(db, 'newlibrary', 'library');
    });
    dropTable(db, 'amiibo').then(r => {
        renameTable(db, 'newamiibo', 'amiibo');
    });
}