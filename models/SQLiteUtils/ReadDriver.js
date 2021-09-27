const sqlite3 = require('sqlite3');
const dbName = './models/db/pixelshelf.db';

module.exports = {
    selectCurrencies: function () {
        return new Promise(function (resolve, reject) {
            let db = new sqlite3.Database(dbName, sqlite3.OPEN_READONLY, (err) => {
                if (err) {
                    reject(err);
                } else {
                    let sql = `SELECT *
                               FROM currency`;
                    db.all(sql, [], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            let result = [];
                            rows.forEach((row) => {
                                result.push({
                                    "code": row.code,
                                    "label": row.label,
                                    "symbol": row.symbol
                                });
                            });
                            resolve(result);
                        }
                    });
                }
            });
        });
    }
}