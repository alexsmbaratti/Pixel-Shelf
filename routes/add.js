var express = require('express');
var router = express.Router();
var SQLite3Driver = require('../models/SQLite3Driver');
var IGDBDriver = require('../models/IGDBDriver');
var EInkDriver = require('../eink/EInkDriver');

router.post('/', function (req, res) {
    let driver = new SQLite3Driver();
    console.log(req.body);
    driver.addGame(req.body).then(result => {
        if (result != undefined) {
            let eInkDriver = new EInkDriver();
            eInkDriver.drawLibrarySize();
            res.status(200).send({"status": 200, "id": result});
        } else {
            res.status(500).send({"status": 500});
        }
    }).catch(err => {
        res.status(500).send({"status": 500});
    });
});

router.post('/game', function (req, res) {
    let driver = new SQLite3Driver();
    driver.lookupGame(req.body.title, req.body.platform).then(result => {
        if (result.found === true) {
            res.status(200).send({"status": 200, "id": result.id, "igdb": result.igdb});
        } else {
            let igdbDriver = new IGDBDriver();
            igdbDriver.getGameByName(req.body.title).then(result => {
                console.log(result)
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
                }).catch(err => {
                    res.status(500).send({"status": 500, "error": err});
                })
            }).catch(err => {
                res.status(500).send({"status": 500, "error": err});
            });
        }
    }).catch(err => {
        res.status(500).send({"status": 500, "error": err});
    });
});

router.post('/edition', function (req, res) {
    let driver = new SQLite3Driver();
    console.log(req.body);
    driver.lookupEdition(req.body.edition, req.body.gameID).then(result => {
        if (result.found === true) {
            res.status(200).send({"status": 200, "id": result.id});
        } else {
            driver.addEdition(req.body).then(addResult => {
                res.status(200).send({"status": 200, "id": addResult});
            }).catch(err => {
                res.status(500).send({"status": 500, "error": err});
            })
        }
    }).catch(err => {
        res.status(500).send({"status": 500, "error": err});
    });
});

router.post('/library', function (req, res) {
    let driver = new SQLite3Driver();
    console.log(req.body);
    driver.addLibrary(req.body).then(addResult => {
        res.status(200).send({"status": 200, "id": addResult});
    }).catch(err => {
        res.status(500).send({"status": 500, "error": err});
    })
});

router.post('/wishlist', function (req, res) {
    let driver = new SQLite3Driver();
    console.log(req.body);
    driver.addWishlist(req.body).then(addResult => {
        res.status(200).send({"status": 200, "id": addResult});
    }).catch(err => {
        res.status(500).send({"status": 500, "error": err});
    })
});

router.get('/mass', function (req, res, next) {
    res.render('mass', {title: 'Pixel Shelf'});
});

router.post('/mass', function (req, res) {
    let driver = new SQLite3Driver();
    driver.massImport(req.body).then(result => {
        let eInkDriver = new EInkDriver();
        eInkDriver.drawLibrarySize();
        res.status(200).send({"status": 200});
    }).catch(err => {
        res.status(500).send({"status": 500});
    });
});

module.exports = router;
