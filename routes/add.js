var express = require('express');
var router = express.Router();
var SQLite3Driver = require('../models/SQLite3Driver');

router.get('/game', function (req, res, next) {
    let driver = new SQLite3Driver();
    driver.getPlatforms().then(result => {
        res.render('add/game', {title: 'Pixel Shelf', platforms: result});
    }).catch(err => {
        res.render('error', {error: err});
    });
});

router.get('/retailer', function (req, res, next) {
    res.render('add/retailer', {title: 'Pixel Shelf'});
});

router.get('/amiibo', function (req, res, next) {
    res.status(501);
    res.render('error', {
        status: 501,
        message: 'This page has not been implemented yet but is planned to be added in a future build.'
    });
});

router.get('/mass', function (req, res, next) {
    res.render('mass', {title: 'Pixel Shelf'});
});

router.post('/mass', function (req, res) {
    let driver = new SQLite3Driver();
    driver.massImport(req.body).then(result => {
        res.status(200).send({"status": 200});
    }).catch(err => {
        res.status(500).send({"status": 500});
    });
});

router.get('/console', function (req, res, next) {
    res.render('add/console', {title: 'Pixel Shelf'});
});

module.exports = router;
