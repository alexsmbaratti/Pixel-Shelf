const sqlite3 = require('sqlite3').verbose();

function SQLite3Driver() {
    SQLite3Driver.prototype.dbName = './models/pixelshelf.db';
}

SQLite3Driver.prototype.getLibrary = function getLibrary() {
    SQLite3Driver.prototype.db = new sqlite3.Database(SQLite3Driver.prototype.dbName, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Connected to SQLite3 DB');
        let sql = 'SELECT game.title FROM game, edition, library INNER JOIN edition e ON library.editionid = e.id INNER JOIN game g ON edition.gameid = g.id';
        SQLite3Driver.prototype.db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                console.log(row.title);
            });
            SQLite3Driver.prototype.db.close();
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