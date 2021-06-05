var express = require('express');
var router = express.Router();
var SQLite3Driver = require('../models/SQLite3Driver');

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
        res.send({"status": 200, "id": result});
    }).catch(err => {
        res.send({"status": 500});
    });
});

router.get('/mass', function (req, res, next) {
    res.render('mass', {title: 'Pixel Shelf'});
});

module.exports = router;
