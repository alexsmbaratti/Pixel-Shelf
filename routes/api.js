var express = require('express');
var router = express.Router();
var SQLite3Driver = require('../models/SQLite3Driver');
var IGDBDriver = require('../models/IGDBDriver');

router.get('/', function (req, res, next) {
    res.status(200).send({"status": 200});
});

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


router.get('/library/size', function (req, res, next) {
    let driver = new SQLite3Driver();
    if (req.query.by === 'platform') {
        res.status(500).send({"status": 501, "msg": "Not implemented!"});
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

router.delete('/library/:libraryId', function (req, res, next) {
    let driver = new SQLite3Driver();
    driver.deleteGame(req.params.libraryId).then(result => {
        res.status(204).send({"status": 204});
    }).catch(err => {
        res.status(500).send({"status": 500, "error": err});
    });
});

router.get('/wishlist', function (req, res, next) {
    let driver = new SQLite3Driver();
    driver.getWishlist(req.query.sortBy).then(result => {
        res.status(200).send({"status": 200, "library": result});
    }).catch(err => {
        res.status(500).send({"status": 500});
    });
});

function sendError(res, err) {
    res.status(500).send({"status": 500, "error": err});
}

module.exports = router;
