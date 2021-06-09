var express = require('express');
var router = express.Router();
var SQLite3Driver = require('../models/SQLite3Driver');

/* GET home page. */
router.get('/', function (req, res, next) {
    let driver = new SQLite3Driver();
    driver.getPlatforms().then(result => {
        console.log(result);
        res.render('platforms', {title: 'Pixel Shelf', platforms: result});
    }).catch(err => {
        res.render('error', {error: err});
    });
});

module.exports = router;
