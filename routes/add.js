var express = require('express');
var router = express.Router();
var SQLite3Driver = require('../models/SQLite3Driver');

router.get('/game', function (req, res, next) {
    SQLite3Driver.getPlatforms().then(platforms => {
        SQLite3Driver.getCurrencies().then(currencies => {
            res.render('add/game', {title: 'Pixel Shelf', platforms: platforms, currencies: currencies});
        }).catch(err => {
            res.render('error', {error: err});
        });
    }).catch(err => {
        res.render('error', {error: err});
    });
});

router.get('/retailer', function (req, res, next) {
    res.render('add/retailer', {title: 'Pixel Shelf'});
});

router.get('/amiibo', function (req, res, next) {
    SQLite3Driver.getSeries().then(result => {
        res.render('add/figure', {title: 'Pixel Shelf', series: result});
    }).catch(err => {
        res.render('error', {error: err});
    });
});

router.get('/console', function (req, res, next) {
    res.render('add/console', {title: 'Pixel Shelf'});
});

module.exports = router;
