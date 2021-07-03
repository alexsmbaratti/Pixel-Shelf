var express = require('express');
var router = express.Router();
var SQLite3Driver = require('../models/SQLite3Driver');
var EInkDriver = require('../eink/EInkDriver');

router.get('/game', function (req, res, next) {
    let driver = new SQLite3Driver();
    driver.getPlatforms().then(result => {
        res.render('add/game', {title: 'Pixel Shelf', platforms: result});
    }).catch(err => {
        res.render('error', {error: err});
    });
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

router.get('/console', function (req, res, next) {
    res.render('add/console', {title: 'Pixel Shelf'});
});

module.exports = router;
