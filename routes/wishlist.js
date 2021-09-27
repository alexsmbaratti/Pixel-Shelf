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
        driver.getCurrencies().then(currencies => {
            res.render('entry/wishlist', {
                title: result.title + ' - Pixel Shelf',
                entry: result,
                id: wishlistId,
                igdb: result.igdbURL,
                currencies: currencies
            });
        }).catch(err => {
            res.render('error', {error: err});
        });
    }).catch(err => {
        res.render('error', {message: "Error", error: err});
    });
});

module.exports = router;
