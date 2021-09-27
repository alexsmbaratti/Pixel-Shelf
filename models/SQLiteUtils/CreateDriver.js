const sqlite3 = require('sqlite3');
const dbName = './models/db/pixelshelf.db';

module.exports = {
    insertGame: function (title, platformID, igdbURL = null) {
        return new Promise(function (resolve, reject) {
            if (title && platformID) {
                let db = new sqlite3.Database(dbName, sqlite3.OPEN_READWRITE, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        db.run(`INSERT
                                INTO game
                                VALUES (?, ?, ?, ?)`, [title, platformID, igdbURL], function (err) {
                            if (err) {
                                reject(err);
                            } else {
                                let gameID = this.lastID;
                                console.log(`INSERT ${title} was inserted with ID ${gameID}`);
                                resolve(gameID);
                            }
                        });
                    }
                });
            } else {
                reject({status: 400});
            }
        });
    }
}