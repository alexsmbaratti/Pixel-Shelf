var express = require('express');
var router = express.Router();
var SQLite3Driver = require('../models/SQLite3Driver');

/* GET home page. */
router.get('/', function (req, res, next) {
    let driver = new SQLite3Driver();
    driver.getLibrary().then(result => {
        console.log(result);
        res.render('library', {title: 'Pixel Shelf', library: result});
    }).catch(err => {
        res.render('error', {error: err});
    });
});

module.exports = router;
