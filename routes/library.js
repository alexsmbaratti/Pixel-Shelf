var express = require('express');
var router = express.Router();
var SQLite3Driver = require('../models/SQLite3Driver');
var IGDBDriver = require('../models/IGDBDriver');
const axios = require('axios');

/* GET home page. */
router.get('/', function (req, res, next) {
    let driver = new SQLite3Driver();
    driver.getLibrary().then(result => {
        console.log(result);
        res.render('library', {title: 'Pixel Shelf', library: result});
    }).catch(err => {
        res.render('error', {error: err});
    });
});

router.get('/size', function (req, res, next) {
    let driver = new SQLite3Driver();
    driver.getLibrarySize().then(result => {
        console.log(result);
        res.status(200).send({"status": 200, "size": result});
    }).catch(err => {
        res.status(500).send({"status": 500});
    });
});

router.get('/:libraryId', function (req, res, next) {
    let driver = new SQLite3Driver();
    const libraryId = req.params.libraryId;
    driver.getLibraryGame(libraryId).then(result => {
        console.log(result);
        if (result.igdbURL != null) {
            coverArtExists(libraryId, req).then(exists => {
                if (!exists) {
                    let igdbDriver = new IGDBDriver();
                    igdbDriver.getGameByURL(result.igdbURL, libraryId).then(igdbRes => {
                        res.render('libraryentry', {
                            title: result.title + ' - Pixel Shelf',
                            entry: result,
                            id: libraryId,
                            igdb: result.igdbURL
                        });
                    }).catch(err => {
                        console.log("Couldn't retrieve cover art!");
                        console.log(err);
                        res.render('libraryentry', {
                            title: result.title + ' - Pixel Shelf',
                            entry: result,
                            id: libraryId,
                            igdb: result.igdbURL
                        });
                    });
                } else {
                    res.render('libraryentry', {
                        title: result.title + ' - Pixel Shelf',
                        entry: result,
                        id: libraryId,
                        igdb: result.igdbURL
                    });
                }
            }).catch(err => {
                res.render('error', {message: "Error", error: err});
            });
        } else {
            res.render('libraryentry', {
                title: result.title + ' - Pixel Shelf',
                entry: result,
                id: libraryId,
                igdb: null
            });
        }
    }).catch(err => {
        res.render('error', {message: "Error", error: err});
    });
});

router.get('/:libraryId/igdb', function (req, res, next) {
    let driver = new SQLite3Driver();
    const libraryId = req.params.libraryId;
    driver.getLibraryGame(libraryId).then(result => {
        if (result.igdbURL != null) {
            let igdbDriver = new IGDBDriver();
            igdbDriver.getGameByURL(result.igdbURL, libraryId).then(igdbRes => {
                res.status(200).send({"status": 200, "data": igdbRes});
            }).catch(err => {
                res.status(500).send({"status": 500});
            });
        }
    }).catch(err => {

    });
});

router.get('/:libraryId/cover', function (req, res, next) {
    let driver = new SQLite3Driver();
    const libraryId = req.params.libraryId;
    driver.getLibraryGame(libraryId).then(result => {
        coverArtExists(libraryId, req).then(exists => {
            if (!exists) {
                if (result.igdbURL != null) {
                    let igdbDriver = new IGDBDriver();
                    igdbDriver.getCoverByURL(result.igdbURL, libraryId).then(igdbRes => {
                        res.redirect('/images/covers/' + libraryId + '.jpg');
                    }).catch(err => {
                        res.redirect('/images/covers/placeholder.jpg');
                    });
                } else {
                    res.redirect('/images/covers/placeholder.jpg');
                }
            } else { // Art is already cached or user-uploaded
                res.redirect('/images/covers/' + libraryId + '.jpg');
            }
        }).catch(err => {
            res.redirect('/images/covers/placeholder.jpg');
        });
    }).catch(err => {
        res.redirect('/images/covers/placeholder.jpg');
    });
});

router.delete('/:libraryId', function (req, res, next) {
    let driver = new SQLite3Driver();
    driver.deleteGame(req.params.libraryId).then(result => {
        console.log(result);
        res.status(204).send({"status": 204});
    }).catch(err => {
        res.status(500).send({"status": 500});
    });
});

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

module.exports = router;
