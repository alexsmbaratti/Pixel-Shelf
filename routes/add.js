var express = require('express');
var router = express.Router();
var SQLite3Driver = require('../models/SQLite3Driver');
var EInkDriver = require('../eink/EInkDriver');

/* GET home page. */
router.get('/', function (req, res, next) {
    let driver = new SQLite3Driver();
    driver.getPlatforms().then(result => {
        console.log(result);
        res.render('add', {title: 'Pixel Shelf', platforms: result});
    }).catch(err => {
        res.render('error', {error: err});
    });
});

router.post('/', function (req, res) {
    let driver = new SQLite3Driver();
    console.log(req.body);
    driver.addGame(req.body).then(result => {
        if (result != undefined) {
            res.status(200).send({"status": 200, "id": result});
            let eInkDriver = new EInkDriver();
            eInkDriver.drawLibrarySize();
        } else {
            res.status(500).send({"status": 500});
        }
    }).catch(err => {
        res.status(500).send({"status": 500});
    });
});

router.get('/mass', function (req, res, next) {
    res.render('mass', {title: 'Pixel Shelf'});
});

router.post('/mass', function (req, res) {
    let driver = new SQLite3Driver();
    driver.massImport(req.body).then(result => {
        res.status(200).send({"status": 200});
        let eInkDriver = new EInkDriver();
        eInkDriver.drawLibrarySize();
    }).catch(err => {
        res.status(500).send({"status": 500});
    });
});

module.exports = router;
