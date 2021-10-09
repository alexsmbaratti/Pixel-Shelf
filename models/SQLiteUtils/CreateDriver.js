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
                                logInsert('game', gameID, title);
                                resolve(gameID);
                            }
                        });
                    }
                });
            } else {
                reject({status: 400});
            }
        });
    },
    insertEdition: function (edition, gameID, upc = null, msrp = null, currencyCode = 'USD', isDigital = false, region = null) {
        return new Promise(function (resolve, reject) {
            if (edition && gameID) {
                let db = new sqlite3.Database(dbName, sqlite3.OPEN_READWRITE, function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        db.run(`INSERT
                                INTO edition
                                VALUES (?, ?, ?, ?, ?, ?, ?,
                                        ?)`, [edition, upc, msrp, gameID, isDigital ? 1 : 0, currencyCode, region], function (err) {
                            if (err) {
                                console.log(err);
                                reject(err);
                            } else {
                                let editionID = this.lastID;
                                logInsert('edition', editionID, edition);
                                resolve(editionID);
                            }
                        });
                    }
                });
            } else {
                reject({status: 400});
            }
        });
    },
    insertLibraryEntry: function (editionID, cost = null, currencyCode = 'USD', timestamp = null, retailerID = null, isNew = true, hasBox = true, hasManual = true, isGift = false, isPrivate = false, notes = null) {
        return new Promise(function (resolve, reject) {
            if (editionID) {
                if (isGift) {
                    cost = 0; // By virtue of being a gift, assume the cost is 0.00 to ensure proper sorting
                }
                let db = new sqlite3.Database(dbName, sqlite3.OPEN_READWRITE, function (err) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        db.run(`INSERT
                                INTO library
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                                        ?)`, [cost, timestamp, editionID, retailerID, isNew ? 1 : 0, hasBox ? 1 : 0, hasManual ? 1 : 0, 0, isGift ? 1 : 0, currencyCode, isPrivate ? 1 : 0, notes], function (err) {
                            if (err) {
                                console.log(err);
                                reject(err);
                            } else {
                                let libraryID = this.lastID;
                                logInsert('library', libraryID);
                                resolve(libraryID);
                            }
                        });
                    }
                });
            } else {
                reject({status: 400});
            }
        });
    },
    insertPlatform: function (name, brandID, igdbURL = null) {
        return new Promise(function (resolve, reject) {
            if (name && brandID) {
                let db = new sqlite3.Database(dbName, sqlite3.OPEN_READWRITE, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        db.run(`INSERT
                                INTO platform
                                VALUES (?, ?, ?, ?)`, [name, brandID, igdbURL], function (err) {
                            if (err) {
                                reject(err);
                            } else {
                                let platformID = this.lastID;
                                logInsert('platform', platformID, name);
                                resolve(platformID);
                            }
                        });
                    }
                });
            } else {
                reject({status: 400});
            }
        });
    },
    insertBrand: function (brandName) {
        return new Promise(function (resolve, reject) {
            if (brandName) {
                let db = new sqlite3.Database(dbName, sqlite3.OPEN_READWRITE, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        db.run(`
                            INSERT
                            INTO brand
                            VALUES (?, ?)`, [brandName], function (err) {
                            if (err) {
                                reject(err);
                            } else {
                                let brandID = this.lastID;
                                logInsert('brand', brandID, brandName);
                                resolve(brandID);
                            }
                        });
                    }
                });
            } else {
                reject({status: 400});
            }
        });
    },
    insertIGDB: function (igdbURL, description = null, releaseDate = null, cover = null) {
        return new Promise(function (resolve, reject) {
            if (igdbURL) {
                let db = new sqlite3.Database(dbName, sqlite3.OPEN_READWRITE, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        db.run(`INSERT
                                INTO igdb
                                VALUES (?, ?, ?, ?)`, [description, cover, releaseDate, igdbURL], function (err) {
                            if (err) {
                                reject(err);
                            } else {
                                let igdbID = this.lastID;
                                logInsert('IGDB', igdbID, igdbURL);
                                resolve(igdbID);
                            }
                        });
                    }
                });
            } else {
                reject({status: 400});
            }
        });
    },
    insertGenre: function (id, description) {
        return new Promise(function (resolve, reject) {
            if (id && description) {
                let db = new sqlite3.Database(dbName, sqlite3.OPEN_READWRITE, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        db.run(`INSERT
                                INTO genre
                                VALUES (?, ?)`, [description, id], function (err) {
                            if (err) {
                                reject(err);
                            } else {
                                let genre = this.lastID;
                                logInsert('genre', genre, description);
                                resolve(genre);
                            }
                        });
                    }
                });
            } else {
                reject({status: 400});
            }
        });
    },
    insertHasAGenre: function (genreID, igdbURL) {
        return new Promise(function (resolve, reject) {
            if (genreID && igdbURL) {
                let db = new sqlite3.Database(dbName, sqlite3.OPEN_READWRITE, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        db.run(`INSERT
                                INTO hasagenre
                                VALUES (?, ?)`, [igdbURL, genreID], function (err) {
                            if (err) {
                                reject(err);
                            } else {
                                logInsert('hasagenre', `(${igdbURL}, ${genreID})`);
                                resolve();
                            }
                        });
                    }
                });
            } else {
                reject({status: 400});
            }
        });
    },
    insertHasARating: function (ratingID, igdbURL) {
        return new Promise(function (resolve, reject) {
            if (ratingID && igdbURL) {
                let db = new sqlite3.Database(dbName, sqlite3.OPEN_READWRITE, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        db.run(`INSERT
                                INTO hasarating
                                VALUES (?, ?)`, [igdbURL, ratingID], function (err) {
                            if (err) {
                                reject(err);
                            } else {
                                logInsert('hasarating', `(${igdbURL}, ${ratingID})`);
                                resolve();
                            }
                        });
                    }
                });
            } else {
                reject({status: 400});
            }
        });
    },
    insertRating: function (ratingID, ratingOrganization) {
        return new Promise(function (resolve, reject) {
            if (ratingID && ratingOrganization) {
                let db = new sqlite3.Database(dbName, sqlite3.OPEN_READWRITE, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        db.run(`INSERT
                                INTO rating
                                VALUES (?, ?)`, [ratingOrganization, ratingID], function (err) {
                            if (err) {
                                reject(err);
                            } else {
                                logInsert('rating', ratingID);
                                resolve(ratingID);
                            }
                        });
                    }
                });
            } else {
                reject({status: 400});
            }
        });
    },
    insertSeries: function (series) {
        return new Promise(function (resolve, reject) {
            if (series) {
                let db = new sqlite3.Database(dbName, sqlite3.OPEN_READWRITE, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        db.run(`INSERT
                                INTO series
                                VALUES (?, ?)`, [series], function (err) {
                            if (err) {
                                reject(err);
                            } else {
                                let seriesID = this.lastID;
                                logInsert('series', seriesID, series);
                                resolve(seriesID);
                            }
                        });
                    }
                });
            } else {
                reject({status: 400});
            }
        });
    },
    insertAmiibo: function (title, seriesID, msrp = null, type = 3, currencyCode = 'USD') {
        return new Promise(function (resolve, reject) {
            if (title && seriesID) {
                let db = new sqlite3.Database(dbName, sqlite3.OPEN_READWRITE, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        db.run(`INSERT
                                INTO amiibo
                                VALUES (?, ?, ?, ?, ?,
                                        ?)`, [title, seriesID, msrp, type, currencyCode], function (err) {
                            if (err) {
                                reject(err);
                            } else {
                                let amiiboID = this.lastID;
                                logInsert('amiibo', amiiboID, title);
                                resolve(amiiboID);
                            }
                        });
                    }
                });
            } else {
                reject({status: 400});
            }
        });
    },
    insertFigure: function (amiiboID, cost = null, timestamp = null, retailerID = null, isNew = true, inBox = true, isGift = false, region = null, currencyCode = 'USD', notes = null) {
        return new Promise(function (resolve, reject) {
            if (amiiboID) {
                let db = new sqlite3.Database(dbName, sqlite3.OPEN_READWRITE, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        db.run(`INSERT
                                INTO figure
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                                        ?)`, [cost, timestamp, retailerID, isNew ? 1 : 0, inBox ? 1 : 0, amiiboID, region, isGift, currencyCode, notes], function (err) {
                            if (err) {
                                reject(err);
                            } else {
                                let figureID = this.lastID;
                                logInsert('figure', figureID);
                                resolve(figureID);
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

function logInsert(table, id, description = null) {
    if (description === null) {
        console.log('INSERT A row was inserted into ' + table + ' table with ID ' + id);
    } else {
        console.log('INSERT ' + description + ' was inserted into ' + table + ' table with ID ' + id);
    }
}