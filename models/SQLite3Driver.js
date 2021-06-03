const sqlite3 = require('sqlite3').verbose();

function SQLite3Driver() {
    SQLite3Driver.prototype.dbName = './models/pixelshelf.db';
}

SQLite3Driver.prototype.getLibrary = function getLibrary() {
    return new Promise(function (resolve, reject) {
        SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                reject(err);
            }
            console.log('Connected to SQLite3 DB');
            let sql = 'SELECT game.title, platform.name, library.month, library.day, library.year, library.cost FROM game, platform, edition, library INNER JOIN edition e ON editionid = e.id INNER JOIN game g ON edition.gameid = g.id INNER JOIN platform p ON p.id = game.platformid';
            SQLite3Driver.prototype.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                }
                let result = [];
                rows.forEach((row) => {
                    console.log(row);
                    result.push({
                        "title": row.title,
                        "platform": row.name,
                        "date-added": row.month + '-' + row.day + '-' + row.year,
                        "cost": row.cost,
                        "edition": row.name
                    });
                });
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