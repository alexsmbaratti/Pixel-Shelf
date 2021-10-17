var express = require('express');
var router = express.Router();
const fs = require('fs');
var jwt = require('jsonwebtoken');
var SQLite3Driver = require('../models/SQLite3Driver');
var IGDBDriver = require('../models/IGDBDriver');
const secrets = require('../models/SecretsDriver');
const si = require('systeminformation');
var axios = require('axios');

const thermalPrinterEndpoint = secrets.thermalPrinterEndpoint();
const mapsKey = secrets.mapsKey();
const mapsID = secrets.mapsKeyID();
const teamID = secrets.mapsTeamID();

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
    let filters = req.query.filters;

    let parsedFilters = [];
    if (filters !== undefined) { // Filters are defined
        if (filters.length > 2 && filters.charAt(0) == '[' && filters.charAt(filters.length - 1) == ']') { // Contains at least []
            parsedFilters = filters.substring(1, filters.length - 1).split(',');
        } else if (filters.length == 2 && filters == '[]') { // Empty brackets with no filters
        } else {
            res.status(400).send({
                "status": 400,
                "error": "Filters are malformed. Filters must be comma-separated enclosed in square brackets."
            });
            return;
        }
    }

    if (sortBy === undefined) {
        sortBy = 'title';
    }

    SQLite3Driver.getLibrary(sortBy, parsedFilters).then(libraryEntries => {
        res.status(200).send({"status": 200, "library": libraryEntries});
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
    SQLite3Driver.getBacklog(sortBy).then(result => {
        res.status(200).send({"status": 200, "backlog": result});
    }).catch(err => {
        sendError(res, err);
    });
});

router.get('/export', function (req, res, next) {
    SQLite3Driver.createBackup().then(result => {
        res.download(`${__dirname}/../models/backups/${result}`, result);
    }).catch(err => {
        sendError(res, err);
    });
});

router.get('/db/stats', function (req, res, next) {
    SQLite3Driver.getDBStats().then(result => {
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
    SQLite3Driver.getCurrentlyPlaying(sortBy).then(result => {
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
    SQLite3Driver.getCompleted(sortBy).then(result => {
        res.status(200).send({"status": 200, "completed": result});
    }).catch(err => {
        sendError(res, err);
    });
});

router.get('/library/size', function (req, res, next) {
    if (req.query.by === 'platform') {
        SQLite3Driver.countByPlatform().then(result => {
            res.status(200).send({"status": 200, "data": result});
        }).catch(err => {
            sendError(res, err);
        });
    } else if (req.query.by === 'brand') {
        SQLite3Driver.countByBrand().then(result => {
            res.status(200).send({"status": 200, "data": result});
        }).catch(err => {
            sendError(res, err);
        });
    } else if (req.query.by === 'progress') {
        SQLite3Driver.countByProgress().then(result => {
            res.status(200).send({"status": 200, "data": result});
        }).catch(err => {
            sendError(res, err);
        });
    } else if (req.query.by === 'condition') {
        SQLite3Driver.countByCondition().then(result => {
            res.status(200).send({"status": 200, "data": result});
        }).catch(err => {
            sendError(res, err);
        });
    } else if (req.query.by === 'date-added') {
        SQLite3Driver.countByDateAdded().then(result => {
            res.status(200).send({"status": 200, "data": result});
        }).catch(err => {
            sendError(res, err);
        });
    } else {
        SQLite3Driver.getLibrarySize().then(result => {
            res.status(200).send({"status": 200, "size": result});
        }).catch(err => {
            sendError(res, err);
        });
    }
});

router.get('/games/:gameId/igdb', function (req, res, next) {
    const gameID = req.params.gameId;
    SQLite3Driver.getCachedIGDBGameMetadataByID(gameID).then(result => {
        res.status(200).send({"status": 200, "data": result});
    }).catch(err => {
        sendError(res, err);
    });
});

router.get('/platforms/:platformId/igdb', function (req, res, next) {
    const platformID = req.params.platformId;
    SQLite3Driver.getCachedPlatformIGDBMetadataByID(platformID).then(result => {
        res.status(200).send({"status": 200, "data": result});
    }).catch(err => {
        sendError(res, err);
    });
});

router.get('/library/:libraryId/', function (req, res, next) {
    const libraryId = req.params.libraryId;
    SQLite3Driver.getLibraryGame(libraryId).then(result => {
        res.status(200).send({"status": 200, "data": result});
    }).catch(err => {
        sendError(res, err);
    });
});

router.put('/library/:libraryId', function (req, res, next) {
    const libraryId = req.params.libraryId;
    SQLite3Driver.updateLibrary(libraryId, req.body).then(() => {
        SQLite3Driver.getLibraryGame(libraryId).then(result => {
            SQLite3Driver.updateEdition(result['editionID'], req.body).then(() => {
                SQLite3Driver.updateGame(result['gameID'], req.body).then(() => {
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
    SQLite3Driver.updateProgress(req.params.libraryId, req.body['progress']).then(result => {
        res.status(204).send({"status": 204});
    }).catch(err => {
        sendError(res, err);
    });
});

router.get('/figures', function (req, res, next) {
    let sortBy = req.query.sortBy;
    let where = req.query.where;
    if (sortBy === null) {
        sortBy = 'title';
    }
    if (where === 'no-date-added') {
        SQLite3Driver.getFiguresWithoutDateAdded().then(result => {
            if (result != undefined) {
                res.status(200).send({"status": 200, "data": result});
            } else {
                sendError(res, "No result");
            }
        }).catch(err => {
            sendError(res, err);
        });
    } else {
        SQLite3Driver.getFigures(sortBy).then(result => {
            res.status(200).send({"status": 200, "figures": result});
        }).catch(err => {
            sendError(res, err);
        });
    }
});

router.get('/retailers', function (req, res, next) {
    let online = req.query.online;
    let sortBy = req.query.sortBy;
    if (sortBy === null) {
        sortBy = 'title';
    }
    if (online !== undefined) {
        if (online === 'false') {
            SQLite3Driver.getPhysicalRetailers().then(result => {
                res.status(200).send({"status": 200, "data": result});
            }).catch(err => {
                sendError(res, err);
            });
        } else {
            res.status(501).send({"status": 501, "msg": "Not Implemented!"});
        }
    } else {
        SQLite3Driver.getRetailers(sortBy).then(result => {
            res.status(200).send({"status": 200, "data": result});
        }).catch(err => {
            sendError(res, err);
        });
    }
});

router.get('/retailers/:retailerId', function (req, res, next) {
    SQLite3Driver.getRetailer(req.params.retailerId).then(result => {
        res.status(200).send({"status": 200, "data": result});
    }).catch(err => {
        sendError(res, err);
    });
});

router.get('/retailers/:retailerId/library', function (req, res, next) {
    SQLite3Driver.getLibraryEntriesFromRetailer(req.params.retailerId).then(result => {
        res.status(200).send({"status": 200, "data": result});
    }).catch(err => {
        sendError(res, err);
    });
});

router.get('/retailers/:retailerId/figures', function (req, res, next) {
    SQLite3Driver.getFiguresFromRetailer(req.params.retailerId).then(result => {
        res.status(200).send({"status": 200, "data": result});
    }).catch(err => {
        sendError(res, err);
    });
});

router.get('/figures/size', function (req, res, next) {
    if (req.query.by === 'date-added') {
        SQLite3Driver.countFiguresByDateAdded().then(result => {
            res.status(200).send({"status": 200, "data": result});
        }).catch(err => {
            sendError(res, err);
        });
    } else {
        SQLite3Driver.getFigureSize().then(result => {
            res.status(200).send({"status": 200, "size": result});
        }).catch(err => {
            sendError(res, err);
        });
    }
});

router.delete('/library/:libraryId', function (req, res, next) {
    SQLite3Driver.deleteGame(req.params.libraryId).then(result => {
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
    SQLite3Driver.getWishlist(sortBy).then(result => {
        res.status(200).send({"status": 200, "library": result});
    }).catch(err => {
        sendError(res, err);
    });
});

router.get('/wishlist/size', function (req, res, next) {
    SQLite3Driver.getWishlistSize().then(result => {
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
            SQLite3Driver.getGamesWithoutLibrary().then(result => {
                if (result != undefined) {
                    res.status(200).send({"status": 200, "data": result});
                } else {
                    sendError(res, "No result");
                }
            }).catch(err => {
                sendError(res, err);
            });
        } else if (where === 'no-igdb') {
            SQLite3Driver.getGamesWithoutIGDBMetadata().then(result => {
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
    const gameId = req.params.gameId;
    SQLite3Driver.getCoverByID(gameId).then(result => {
        res.redirect(result);
    }).catch(err => {
        res.redirect('/images/covers/placeholder.jpg');
    });
});

router.get('/amiibo/:amiiboID/cover', function (req, res, next) {
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
});

router.get('/platforms/:platformId/logo', function (req, res, next) {
    const platformID = req.params.platformId;
    SQLite3Driver.getLogoByID(platformID).then(result => {
        res.redirect(result);
    }).catch(err => {
        res.redirect('/images/logos/placeholder.png');
    });
});

router.get('/editions', function (req, res, next) {
    let upc = req.query.upc;
    let where = req.query.where;
    if (where !== undefined) {
        if (where === 'no-upc') {
            SQLite3Driver.getEditionsWithoutUPC().then(result => {
                if (result != undefined) {
                    res.status(200).send({"status": 200, "data": result});
                } else {
                    sendError(res, "No result");
                }
            }).catch(err => {
                sendError(res, err);
            });
        } else if (where === 'no-msrp') {
            SQLite3Driver.getEditionsWithoutMSRP().then(result => {
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
        SQLite3Driver.lookupByUPC(upc).then(result => {
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
    SQLite3Driver.checkStatus().then(result => {
        res.status(200).send({"status": 200});
    }).catch(err => {
        sendError(res, err);
    });
});

router.post('/games', function (req, res) {
    SQLite3Driver.lookupGame(req.body.title, req.body.platform).then(gameResult => {
        if (gameResult.found === true) {
            res.status(200).send({"status": 200, "id": gameResult.id, "igdb": gameResult.igdb});
        } else {
            IGDBDriver.getGameByName(req.body.title).then(result => {
                let igdbLink;
                if (result.length < 1) {
                    igdbLink = null;
                } else {
                    igdbLink = result[0].url;
                }
                SQLite3Driver.addGame({
                    "title": req.body.title,
                    "platform": req.body.platform,
                    "igdb-url": igdbLink
                }).then(addResult => {
                    res.status(200).send({"status": 200, "id": addResult, "igdb": igdbLink});
                }).catch(err => {
                    sendError(res, err);
                })
            }).catch(err => { // For some reason IGDB cannot be reached, just set the metadata to null and allow the user to manually add it later
                SQLite3Driver.addGame({
                    "title": req.body.title,
                    "platform": req.body.platform,
                    "igdb-url": null
                }).then(addResult => {
                    res.status(200).send({"status": 200, "id": addResult});
                }).catch(err => {
                    sendError(res, err);
                })
            });
        }
    }).catch(err => {
        sendError(res, err);
    });
});

router.post('/editions', function (req, res) {
    SQLite3Driver.lookupEdition(req.body.edition, req.body.gameID, req.body.digital).then(result => {
        if (result.found === true) {
            res.status(200).send({"status": 200, "id": result.id});
        } else {
            SQLite3Driver.addEdition(req.body).then(addResult => {
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
    SQLite3Driver.addLibrary(req.body).then(addResult => {
        res.status(200).send({"status": 200, "id": addResult});
    }).catch(err => {
        sendError(res, err);
    });
});

router.post('/series', function (req, res) {
    SQLite3Driver.addSeries(req.body).then(addResult => {
        res.status(200).send({"status": 200, "id": addResult});
    }).catch(err => {
        sendError(res, err);
    });
});

router.post('/amiibo', function (req, res) {
    SQLite3Driver.lookupAmiibo(req.body.title, req.body.seriesID).then(result => {
        if (result.found === true) {
            res.status(200).send({"status": 200, "id": result.id});
        } else {
            SQLite3Driver.addAmiibo(req.body).then(addResult => {
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
    SQLite3Driver.addFigure(req.body).then(addResult => {
        res.status(200).send({"status": 200, "id": addResult});
    }).catch(err => {
        sendError(res, err);
    });
});

router.post('/retailers', function (req, res) {
    SQLite3Driver.addRetailer(req.body).then(addResult => {
        res.status(200).send({"status": 200, "id": addResult});
    }).catch(err => {
        sendError(res, err);
    });
});

router.post('/consoles', function (req, res) {
    SQLite3Driver.lookupBrand(req.body.brand).then(result => {
        let consoleData = {
            "name": req.body['name'],
            "brandID": result['id']
        };
        if (result.found === true) {
            IGDBDriver.getPlatformByName(consoleData['name']).then(result => {
                if (result.length > 0) {
                    consoleData['igdb-url'] = result[0].url;
                }
                SQLite3Driver.addConsole(consoleData).then(addResult => {
                    res.status(200).send({"status": 200, "id": addResult});
                }).catch(err => {
                    sendError(res, err);
                });
            });
        } else {
            SQLite3Driver.addBrand(req.body).then(brandID => {
                consoleData['brandID'] = brandID;
                IGDBDriver.getPlatformByName(consoleData['name']).then(result => {
                    if (result.length > 0) {
                        consoleData['igdb-url'] = result[0].url;
                    }
                    SQLite3Driver.addConsole(consoleData).then(addResult => {
                        res.status(200).send({"status": 200, "id": addResult});
                    }).catch(err => {
                        sendError(res, err);
                    });
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
    SQLite3Driver.addWishlist(req.body).then(addResult => {
        res.status(200).send({"status": 200, "id": addResult});
    }).catch(err => {
        sendError(res, err);
    })
});

router.post('/wishlist/:wishlistId/library', function (req, res) {
    res.status(501).send({"status": 501, "error": "Not implemented!"});
});

router.get('/igdb', function (req, res) {
    IGDBDriver.checkStatus().then(result => {
        res.status(200).send({"status": 200});
    }).catch(err => {
        sendError(res, err);
    })
});

router.post('/thermal-printer/:libraryId', function (req, res) {
    const libraryId = req.params.libraryId;

    if (thermalPrinterEndpoint) {
        SQLite3Driver.getLibraryGame(libraryId).then(libraryGame => {
            axios({
                method: 'post',
                url: thermalPrinterEndpoint + '/api/pixel-shelf/library',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: libraryGame
            })
                .then(function (result) {
                    res.status(200).send({"status": 200});
                })
                .catch(function (err) {
                    sendError(res, err);
                });
        }).catch(function (err) {
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
    IGDBDriver.regenerateToken().then(result => {
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
