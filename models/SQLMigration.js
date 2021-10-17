const sqlite3 = require('sqlite3').verbose();

const dbName = 'PATH/TO/DB';

let db = new sqlite3.Database(dbName, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.log(err);
    } else {
        // dropTable(db, 'platform').then(r => {
        //     renameTable(db, 'newplatform', 'platform');
        // });

        createTable(db, `CREATE TABLE newplatform
                         (
                             name    TEXT NOT NULL,
                             brandid INTEGER,
                             igdbURL TEXT,
                             id      INTEGER PRIMARY KEY AUTOINCREMENT,
                             FOREIGN KEY (brandid) REFERENCES brand (id) ON DELETE CASCADE,
                             FOREIGN KEY (igdbURL) REFERENCES igdbplatform (igdbURL) ON DELETE SET NULL
                         );`, 'newplatform')
            .then(() => {
                db.each(`SELECT *
                         FROM platform`, [], (err, row) => {
                    if (err) {
                        console.log(err);
                        throw err;
                    } else {
                        db.run(`INSERT
                                INTO newplatform
                                VALUES (?, ?, ?, ?)`, [row['name'], row['brandid'], null, row['id']], function (err) {
                            if (err) {
                                console.log(err);
                            } else {
                                let libraryID = this.lastID;
                                console.log(`INSERT
                                A row was inserted into library table with ID
                                ${libraryID}`);
                            }
                        });
                    }
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
                console.log(`DROP
                ${table} table dropped`);
                resolve();
            }
        });
    });
}

function renameTable(db, table, newTable) {
    return new Promise(function (resolve, reject) {
        db.run(`ALTER TABLE ${table}
            RENAME TO ${newTable}`, [], function (err) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log(`ALTER
                ${table} table renamed to
                ${newTable}`);
                resolve();
            }
        });
    });
}