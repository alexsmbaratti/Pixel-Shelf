var express = require('express');
var router = express.Router();
var SQLite3Driver = require('../models/SQLite3Driver');

/* GET home page. */
router.get('/', function (req, res, next) {
    SQLite3Driver.getPlatforms().then(result => {
        res.render('platforms', {title: 'Pixel Shelf', platforms: result});
    }).catch(err => {
        res.render('error', {error: err});
    });
});

router.get('/:platformId', function (req, res, next) {
    const platformId = req.params.platformId;
    SQLite3Driver.getPlatform(platformId).then(result => {
        if (result && result.constructor === Object && Object.keys(result).length === 0) {
            res.status(404);
            res.render('entry/404', {type: 'Console'});
        } else {
            res.render('entry/console', {
                title: result.name + ' - Pixel Shelf',
                entry: result,
                id: platformId
            });
        }
    }).catch(err => {
        res.render('error', {message: "Error", error: err});
    });
});

module.exports = router;
