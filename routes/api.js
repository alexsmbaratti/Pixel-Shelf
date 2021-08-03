var express = require('express');
var router = express.Router();
var SQLite3Driver = require('../models/SQLite3Driver');
var IGDBDriver = require('../models/IGDBDriver');
const thermalPrinterEndpoint = require('../config.json')['thermal-printer-endpoint'];
const si = require('systeminformation');
var axios = require('axios');

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
    if (sortBy === null) {
        sortBy = 'title';
    }
    let driver = new SQLite3Driver();
    driver.getLibrary(sortBy).then(result => {
        res.status(200).send({"status": 200, "library": result});
    }).catch(err => {
        sendError(res, err);
    });
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
    res.status(501).send({"status": 501, "msg": "Not Implemented!"});
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

router.get('/amiibo', function (req, res, next) {
    res.status(501).send({"status": 501, "msg": "Not Implemented!"});
});

router.get('/amiibo/size', function (req, res, next) {
    let driver = new SQLite3Driver();
    driver.getFigureSize().then(result => {
        res.status(200).send({"status": 200, "size": result});
    }).catch(err => {
        sendError(res, err);
    });
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
                        sendError(res, err);
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
    driver.lookupEdition(req.body.edition, req.body.gameID).then(result => {
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

function sendError(res, err) {
    res.status(500).send({"status": 500, "error": err});
}

module.exports = router;
