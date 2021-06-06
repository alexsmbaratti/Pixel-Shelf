var express = require('express');
var router = express.Router();
var SQLite3Driver = require('../models/SQLite3Driver');

/* GET home page. */
router.get('/', function (req, res, next) {
    let platforms = [];
    res.render('platforms', {title: 'Pixel Shelf', platforms: platforms});
});

module.exports = router;
