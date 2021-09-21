var express = require('express');
var router = express.Router();
var SQLite3Driver = require('../models/SQLite3Driver');
var IGDBDriver = require('../models/IGDBDriver');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('wishlist', {title: 'Pixel Shelf'});
});

router.get('/:wishlistId', function (req, res, next) {
    let driver = new SQLite3Driver();
    const wishlistId = req.params.wishlistId;
    driver.getWishlistGame(wishlistId).then(result => {
        res.render('entry/wishlist', {
            title: result.title + ' - Pixel Shelf',
            entry: result,
            id: wishlistId,
            igdb: result.igdbURL
        });
    }).catch(err => {
        if (err['status'] === 404) {
            res.status(404);
            res.render('404', {title: 'Pixel Shelf', type: 'game'});
        } else {
            res.render('error', {message: "Error", error: err});
        }
    });
});

router.get('/:gameId/igdb', function (req, res, next) {
    let driver = new SQLite3Driver();
    const gameId = req.params.gameId;
    driver.getGame(gameId).then(result => {
        if (result.igdbURL != null) {
            let igdbDriver = new IGDBDriver();
            igdbDriver.getGameByURL(result.igdbURL).then(igdbRes => {
                res.status(200).send({"status": 200, "data": igdbRes});
            }).catch(err => {
                res.status(500).send({"status": 500});
            });
        } else {
            res.status(500).send({"status": 500});
        }
    }).catch(err => {
        res.status(500).send({"status": 500});
    });
});

module.exports = router;
