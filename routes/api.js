var express = require('express');
var router = express.Router();
const fs = require('fs');
var jwt = require('jsonwebtoken');
var SQLite3Driver = require('../models/SQLite3Driver');
var IGDBDriver = require('../models/IGDBDriver');
const si = require('systeminformation');
var axios = require('axios');

const thermalPrinterEndpoint = require('../config.json')['thermal-printer-endpoint'];
const mapsKey = require('../config.json')['maps-key-path'];
const mapsID = require('../config.json')['maps-key-id'];
const teamID = require('../config.json')['maps-team-id'];
var key = null;
if (mapsKey) {
    key = fs.readFileSync(mapsKey);
}

/**
 * Returns status code 200 if the server is online
 */
router.get('/', function (req, res, next) {
    res.status(200).send({"status": 200});
});

/**
 * Returns status code 200 with an array of library entries
 */
router.get('/library', function (req, res, next) {
    let sortBy = req.query.sortBy;
    let where = req.query.where;
    if (sortBy === null) {
        sortBy = 'title';
    }
    let driver = new SQLite3Driver();
    if (where !== undefined) {
        if (where === 'no-cost') {
            driver.getLibraryEntriesWithoutCost().then(result => {
                if (result != undefined) {
                    res.status(200).send({"status": 200, "data": result});
                } else {
                    sendError(res, "No result");
                }
            }).catch(err => {
                sendError(res, err);
            });
        } else if (where === 'no-date-added') {
            driver.getLibraryEntriesWithoutDateAdded().then(result => {
                if (result != undefined) {
                    res.status(200).send({"status": 200, "data": result});
                } else {
                    sendError(res, "No result");
                }
            }).catch(err => {
                sendError(res, err);
            });
        } else if (where === 'no-retailer') {
            driver.getLibraryEntriesWithoutRetailer().then(result => {
                if (result != undefined) {
                    res.status(200).send({"status": 200, "data": result});
                } else {
                    sendError(res, "No result");
                }
            }).catch(err => {
                sendError(res, err);
            });
        } else {
            res.status(501).send({"status": 501, "msg": "Not Implemented!"});
        }
    } else {
        driver.getLibrary(sortBy).then(result => {
            res.status(200).send({"status": 200, "library": result});
        }).catch(err => {
            sendError(res, err);
        });
    }
});

router.get('/system/platform', function (req, res, next) {
    si.osInfo().then(data => {
        res.status(200).send({
            "status": 200,
            "data": {"platform": data['platform'], "distro": data['distro'], "release": data['release']}
        });
    }).catch(err => {
        sendError(res, err);
    });
});

router.get('/library/backlog', function (req, res, next) {
    let sortBy = req.query.sortBy;
    if (sortBy === null) {
        sortBy = 'title';
    }
    let driver = new SQLite3Driver();
    driver.getBacklog(sortBy).then(result => {
        res.status(200).send({"status": 200, "backlog": result});
    }).catch(err => {
        sendError(res, err);
    });
});

router.get('/export', function (req, res, next) {
    let driver = new SQLite3Driver();
    driver.createBackup().then(result => {
        res.download(`${__dirname}/../models/backups/${result}`, result);
    }).catch(err => {
        sendError(res, err);
    });
});

router.get('/db/stats', function (req, res, next) {
    let driver = new SQLite3Driver();
    driver.getDBStats().then(result => {
        res.status(200).send({"status": 200, "stats": result});
    }).catch(err => {
        sendError(res, err);
    });
});

router.get('/library/playing', function (req, res, next) {
    let sortBy = req.query.sortBy;
    if (sortBy === null) {
        sortBy = 'title';
    }
    let driver = new SQLite3Driver();
    driver.getCurrentlyPlaying(sortBy).then(result => {
        res.status(200).send({"status": 200, "currentlyPlaying": result});
    }).catch(err => {
        sendError(res, err);
    });
});

router.get('/library/completed', function (req, res, next) {
    let sortBy = req.query.sortBy;
    if (sortBy === null) {
        sortBy = 'title';
    }
    let driver = new SQLite3Driver();
    driver.getCompleted(sortBy).then(result => {
        res.status(200).send({"status": 200, "completed": result});
    }).catch(err => {
        sendError(res, err);
    });
});

router.get('/library/size', function (req, res, next) {
    let driver = new SQLite3Driver();
    if (req.query.by === 'platform') {
        driver.countByPlatform().then(result => {
            res.status(200).send({"status": 200, "data": result});
        }).catch(err => {
            sendError(res, err);
        });
    } else if (req.query.by === 'brand') {
        driver.countByBrand().then(result => {
            res.status(200).send({"status": 200, "data": result});
        }).catch(err => {
            sendError(res, err);
        });
    } else if (req.query.by === 'progress') {
        driver.countByProgress().then(result => {
            res.status(200).send({"status": 200, "data": result});
        }).catch(err => {
            sendError(res, err);
        });
    } else if (req.query.by === 'condition') {
        driver.countByCondition().then(result => {
            res.status(200).send({"status": 200, "data": result});
        }).catch(err => {
            sendError(res, err);
        });
    } else if (req.query.by === 'date-added') {
        driver.countByDateAdded().then(result => {
            res.status(200).send({"status": 200, "data": result});
        }).catch(err => {
            sendError(res, err);
        });
    } else {
        driver.getLibrarySize().then(result => {
            res.status(200).send({"status": 200, "size": result});
        }).catch(err => {
            sendError(res, err);
        });
    }
});

router.get('/library/:libraryId/igdb', function (req, res, next) {
    let driver = new SQLite3Driver();
    const libraryId = req.params.libraryId;
    driver.getLibraryGame(libraryId).then(result => {
        if (result.igdbURL != null) {
            let igdbDriver = new IGDBDriver();
            igdbDriver.getGameByURL(result.igdbURL).then(igdbRes => {
                res.status(200).send({"status": 200, "data": igdbRes});
            }).catch(err => {
                sendError(res, err);
            });
        }
    }).catch(err => {
        sendError(res, err);
    });
});

router.get('/library/:libraryId/', function (req, res, next) {
    let driver = new SQLite3Driver();
    const libraryId = req.params.libraryId;
    driver.getLibraryGame(libraryId).then(result => {
        res.status(200).send({"status": 200, "data": result});
    }).catch(err => {
        sendError(res, err);
    });
});

router.put('/library/:libraryId', function (req, res, next) {
    let driver = new SQLite3Driver();
    const libraryId = req.params.libraryId;
    driver.updateLibrary(libraryId, req.body).then(() => {
        driver.getLibraryGame(libraryId).then(result => {
            driver.updateEdition(result['editionID'], req.body).then(() => {
                driver.updateGame(result['gameID'], req.body).then(() => {
                    res.status(204).send({"status": 204});
                }).catch(err => {
                    sendError(res, err);
                });
            }).catch(err => {
                sendError(res, err);
            });
        }).catch(err => {
            sendError(res, err);
        });

    }).catch(err => {
        sendError(res, err);
    });
});

router.put('/library/:libraryId/progress', function (req, res, next) {
    let driver = new SQLite3Driver();
    driver.updateProgress(req.params.libraryId, req.body['progress']).then(result => {
        res.status(204).send({"status": 204});
    }).catch(err => {
        sendError(res, err);
    });
});

router.get('/figures', function (req, res, next) {
    let driver = new SQLite3Driver();
    let sortBy = req.query.sortBy;
    let where = req.query.where;
    if (sortBy === null) {
        sortBy = 'title';
    }
    if (where === 'no-date-added') {
        driver.getFiguresWithoutDateAdded().then(result => {
            if (result != undefined) {
                console.log(result)
                res.status(200).send({"status": 200, "data": result});
            } else {
                sendError(res, "No result");
            }
        }).catch(err => {
            sendError(res, err);
        });
    } else {
        driver.getFigures(sortBy).then(result => {
            res.status(200).send({"status": 200, "figures": result});
        }).catch(err => {
            sendError(res, err);
        });
    }
});

router.get('/retailers', function (req, res, next) {
    let driver = new SQLite3Driver();
    let online = req.query.online;
    let sortBy = req.query.sortBy;
    if (sortBy === null) {
        sortBy = 'title';
    }
    if (online !== undefined) {
        if (online === 'false') {
            driver.getPhysicalRetailers().then(result => {
                res.status(200).send({"status": 200, "data": result});
            }).catch(err => {
                sendError(res, err);
            });
        } else {
            res.status(501).send({"status": 501, "msg": "Not Implemented!"});
        }
    } else {
        driver.getRetailers(sortBy).then(result => {
            res.status(200).send({"status": 200, "data": result});
        }).catch(err => {
            sendError(res, err);
        });
    }
});

router.get('/retailers/:retailerId', function (req, res, next) {
    let driver = new SQLite3Driver();
    driver.getRetailer(req.params.retailerId).then(result => {
        res.status(200).send({"status": 200, "data": result});
    }).catch(err => {
        sendError(res, err);
    });
});

router.get('/retailers/:retailerId/library', function (req, res, next) {
    let driver = new SQLite3Driver();
    driver.getLibraryEntriesFromRetailer(req.params.retailerId).then(result => {
        res.status(200).send({"status": 200, "data": result});
    }).catch(err => {
        sendError(res, err);
    });
});

router.get('/retailers/:retailerId/figures', function (req, res, next) {
    let driver = new SQLite3Driver();
    driver.getFiguresFromRetailer(req.params.retailerId).then(result => {
        res.status(200).send({"status": 200, "data": result});
    }).catch(err => {
        sendError(res, err);
    });
});

router.get('/figures/size', function (req, res, next) {
    let driver = new SQLite3Driver();
    if (req.query.by === 'date-added') {
        driver.countFiguresByDateAdded().then(result => {
            res.status(200).send({"status": 200, "data": result});
        }).catch(err => {
            sendError(res, err);
        });
    } else {
        driver.getFigureSize().then(result => {
            res.status(200).send({"status": 200, "size": result});
        }).catch(err => {
            sendError(res, err);
        });
    }
});

router.delete('/library/:libraryId', function (req, res, next) {
    let driver = new SQLite3Driver();
    driver.deleteGame(req.params.libraryId).then(result => {
        res.status(204).send({"status": 204});
    }).catch(err => {
        sendError(res, err);
    });
});

router.get('/wishlist', function (req, res, next) {
    let sortBy = req.query.sortBy;
    if (sortBy === null) {
        sortBy = 'title';
    }
    let driver = new SQLite3Driver();
    driver.getWishlist(sortBy).then(result => {
        res.status(200).send({"status": 200, "library": result});
    }).catch(err => {
        sendError(res, err);
    });
});

router.get('/wishlist/size', function (req, res, next) {
    let driver = new SQLite3Driver();
    driver.getWishlistSize().then(result => {
        res.status(200).send({"status": 200, "size": result});
    }).catch(err => {
        sendError(res, err);
    });
});

/*
    Add query params to filter which games are returned
    i.e. /api/games?title="Gex"
 */
router.get('/games', function (req, res, next) {
    let where = req.query.where;
    if (where !== undefined) {
        if (where === 'no-library') {
            let driver = new SQLite3Driver();
            driver.getGamesWithoutLibrary().then(result => {
                if (result != undefined) {
                    res.status(200).send({"status": 200, "data": result});
                } else {
                    sendError(res, "No result");
                }
            }).catch(err => {
                sendError(res, err);
            });
        } else if (where === 'no-igdb') {
            let driver = new SQLite3Driver();
            driver.getGamesWithoutIGDBMetadata().then(result => {
                if (result != undefined) {
                    res.status(200).send({"status": 200, "data": result});
                } else {
                    sendError(res, "No result");
                }
            }).catch(err => {
                sendError(res, err);
            });
        } else {
            res.status(501).send({"status": 501, "msg": "Not implemented!"});
        }
    } else {
        res.status(501).send({"status": 501, "msg": "Not implemented!"});
    }
});

router.get('/games/:id', function (req, res, next) {
    res.status(501).send({"status": 501, "msg": "Not implemented!"});
});

router.get('/games/:gameId/cover', function (req, res, next) {
    let driver = new SQLite3Driver();
    const gameId = req.params.gameId;
    driver.getGame(gameId).then(result => {
        coverArtExists(gameId, req).then(exists => {
            if (!exists) {
                if (result.igdbURL != null) { // Cache the IGDB cover
                    let igdbDriver = new IGDBDriver();
                    igdbDriver.getCoverByURL(result.igdbURL, gameId).then(igdbRes => {
                        res.redirect('/images/covers/' + gameId + '.jpg');
                    }).catch(err => {
                        console.log(err);
                        res.redirect('/images/covers/placeholder.jpg');
                    });
                } else { // No IGDB link
                    res.redirect('/images/covers/placeholder.jpg');
                }
            } else { // Art is already cached or user-uploaded
                res.redirect('/images/covers/' + gameId + '.jpg');
            }
        }).catch(err => {
            console.log(err);
            res.redirect('/images/covers/placeholder.jpg');
        });
    }).catch(err => {
        console.log(err);
        res.redirect('/images/covers/placeholder.jpg');
    });
});

router.get('/amiibo/:amiiboID/cover', function (req, res, next) {
    let driver = new SQLite3Driver();
    const amiiboID = req.params.amiiboID;
    figureArtExists(amiiboID, req).then(exists => {
        if (!exists) {
            res.redirect('/images/amiibo/placeholder.png');
        } else { // Art is already cached or user-uploaded
            res.redirect('/images/amiibo/' + amiiboID + '.png');
        }
    }).catch(err => {
        console.log(err);
        res.redirect('/images/covers/placeholder.jpg');
    });

})
;

router.get('/editions', function (req, res, next) {
    let upc = req.query.upc;
    let where = req.query.where;
    if (where !== undefined) {
        if (where === 'no-upc') {
            let driver = new SQLite3Driver();
            driver.getEditionsWithoutUPC().then(result => {
                if (result != undefined) {
                    res.status(200).send({"status": 200, "data": result});
                } else {
                    sendError(res, "No result");
                }
            }).catch(err => {
                sendError(res, err);
            });
        } else if (where === 'no-msrp') {
            let driver = new SQLite3Driver();
            driver.getEditionsWithoutMSRP().then(result => {
                if (result != undefined) {
                    res.status(200).send({"status": 200, "data": result});
                } else {
                    sendError(res, "No result");
                }
            }).catch(err => {
                sendError(res, err);
            });
        }
    } else if (upc !== undefined) {
        let driver = new SQLite3Driver();
        driver.lookupByUPC(upc).then(result => {
            if (result != undefined) {
                res.status(200).send({"status": 200, "data": result});
            } else {
                res.status(404).send({"status": 404});
            }
        }).catch(err => {
            sendError(res, err);
        });
    } else {
        res.status(501).send({"status": 501, "msg": "Not implemented!"});
    }
});

router.get('/editions/:id', function (req, res, next) {
    res.status(501).send({"status": 501, "msg": "Not implemented!"});
});

router.get('/db', function (req, res, next) {
    let driver = new SQLite3Driver();
    driver.checkStatus().then(result => {
        res.status(200).send({"status": 200});
    }).catch(err => {
        sendError(res, err);
    });
});

router.post('/games', function (req, res) {
    let driver = new SQLite3Driver();
    driver.lookupGame(req.body.title, req.body.platform).then(gameResult => {
        if (gameResult.found === true) {
            res.status(200).send({"status": 200, "id": gameResult.id, "igdb": gameResult.igdb});
        } else {
            let igdbDriver = new IGDBDriver();
            igdbDriver.getGameByName(req.body.title).then(result => {
                let igdbLink;
                if (result.length < 1) {
                    igdbLink = null;
                } else {
                    igdbLink = result[0].url;
                }
                driver.addGame({
                    "title": req.body.title,
                    "platform": req.body.platform,
                    "igdb-url": igdbLink
                }).then(addResult => {
                    res.status(200).send({"status": 200, "id": addResult, "igdb": igdbLink});
                    igdbDriver.getCoverByURL(igdbLink, addResult).catch(err => {
                        console.log(err);
                    });
                }).catch(err => {
                    sendError(res, err);
                })
            }).catch(err => {
                sendError(res, err);
            });
        }
    }).catch(err => {
        sendError(res, err);
    });
});

router.post('/editions', function (req, res) {
    let driver = new SQLite3Driver();
    driver.lookupEdition(req.body.edition, req.body.gameID, req.body.digital).then(result => {
        if (result.found === true) {
            res.status(200).send({"status": 200, "id": result.id});
        } else {
            driver.addEdition(req.body).then(addResult => {
                res.status(200).send({"status": 200, "id": addResult});
            }).catch(err => {
                sendError(res, err);
            })
        }
    }).catch(err => {
        sendError(res, err);
    });
});

router.post('/library', function (req, res) {
    let driver = new SQLite3Driver();
    driver.addLibrary(req.body).then(addResult => {
        res.status(200).send({"status": 200, "id": addResult});
    }).catch(err => {
        sendError(res, err);
    });
});

router.post('/series', function (req, res) {
    let driver = new SQLite3Driver();
    driver.addSeries(req.body).then(addResult => {
        res.status(200).send({"status": 200, "id": addResult});
    }).catch(err => {
        sendError(res, err);
    });
});

router.post('/amiibo', function (req, res) {
    let driver = new SQLite3Driver();
    driver.lookupAmiibo(req.body.title, req.body.seriesID).then(result => {
        if (result.found === true) {
            res.status(200).send({"status": 200, "id": result.id});
        } else {
            driver.addAmiibo(req.body).then(addResult => {
                res.status(200).send({"status": 200, "id": addResult});
            }).catch(err => {
                sendError(res, err);
            });
        }
    }).catch(err => {
        sendError(res, err);
    });
});

router.post('/figures', function (req, res) {
    let driver = new SQLite3Driver();
    driver.addFigure(req.body).then(addResult => {
        res.status(200).send({"status": 200, "id": addResult});
    }).catch(err => {
        sendError(res, err);
    });
});

router.post('/retailers', function (req, res) {
    let driver = new SQLite3Driver();
    driver.addRetailer(req.body).then(addResult => {
        res.status(200).send({"status": 200, "id": addResult});
    }).catch(err => {
        sendError(res, err);
    });
});

router.post('/consoles', function (req, res) {
    let driver = new SQLite3Driver();
    driver.lookupBrand(req.body.brand).then(result => {
        if (result.found === true) {
            let consoleData = {
                "name": req.body['name'],
                "brandID": result['id']
            };
            driver.addConsole(consoleData).then(addResult => {
                res.status(200).send({"status": 200, "id": addResult});
            }).catch(err => {
                sendError(res, err);
            });
        } else {
            driver.addBrand(req.body).then(brandID => {
                let consoleData = {
                    "name": req.body['name'],
                    "brandID": brandID
                };
                driver.addConsole(consoleData).then(addResult => {
                    res.status(200).send({"status": 200, "id": addResult});
                }).catch(err => {
                    sendError(res, err);
                });
            }).catch(err => {
                sendError(res, err);
            });
        }
    }).catch(err => {
        sendError(res, err);
    });
});

router.post('/wishlist', function (req, res) {
    let driver = new SQLite3Driver();
    driver.addWishlist(req.body).then(addResult => {
        res.status(200).send({"status": 200, "id": addResult});
    }).catch(err => {
        sendError(res, err);
    })
});

router.get('/igdb', function (req, res) {
    let driver = new IGDBDriver();
    driver.checkStatus().then(result => {
        res.status(200).send({"status": 200});
    }).catch(err => {
        sendError(res, err);
    })
});

router.post('/thermal-printer/:libraryId', function (req, res) {
    const libraryId = req.params.libraryId;

    if (thermalPrinterEndpoint) {
        axios({
            method: 'post',
            url: thermalPrinterEndpoint + '/api/pixel-shelf/library/' + libraryId,
            headers: {}
        })
            .then(function (result) {
                res.status(200).send({"status": 200});
            })
            .catch(function (err) {
                sendError(res, err);
            });
    } else {
        res.status(501).send({"status": 501, "error": "Thermal Printer not configured!"});
    }
});

router.get('/thermal-printer', function (req, res) {
    if (thermalPrinterEndpoint) {
        axios({
            method: 'get',
            url: thermalPrinterEndpoint,
            headers: {}
        })
            .then(function (result) {
                res.status(result.status).send({"status": result.status});
            })
            .catch(function (err) {
                sendError(res, err);
            });
    } else {
        res.status(501).send({"status": 501, "error": "Thermal Printer not configured!"});
    }
});

router.get('/igdb/client-id', function (req, res) {
    res.status(501).send({"status": 501});
});

router.get('/igdb/client-secret', function (req, res) {
    res.status(501).send({"status": 501});
});

router.put('/igdb/regen-token', function (req, res) {
    let driver = new IGDBDriver();
    driver.regenerateToken().then(result => {
        res.status(200).send({"status": 200});
    }).catch(err => {
        sendError(res, err);
    });
});

router.get('/maps/token', function (req, res, next) {
    if (mapsKey) {
        var token = jwt.sign({
            "iss": teamID,
            "iat": Date.now() / 1000,
            "exp": (Date.now() / 1000) + 86400,
        }, key, {
            header: {
                "alg": "ES256",
                "typ": "JWT",
                "kid": mapsID
            }
        });
        res.status(200).send({"status": 200, "token": token});
    } else {
        res.status(501).send({"status": 501});
    }
});

function sendError(res, err) {
    res.status(500).send({"status": 500, "error": err});
}

function coverArtExists(id, req) {
    return new Promise(function (resolve, reject) {
        axios.get(`${req.protocol}://${req.get('host')}/images/covers/${id}.jpg`)
            .then(response => {
                resolve(true);
            })
            .catch(err => {
                if (err.response.status == 404) {
                    resolve(false);
                } else {
                    reject(err);
                }
            });
    });
}

function figureArtExists(id, req) {
    return new Promise(function (resolve, reject) {
        axios.get(`${req.protocol}://${req.get('host')}/images/amiibo/${id}.png`)
            .then(response => {
                resolve(true);
            })
            .catch(err => {
                if (err.response.status == 404) {
                    resolve(false);
                } else {
                    reject(err);
                }
            });
    });
}

module.exports = router;
