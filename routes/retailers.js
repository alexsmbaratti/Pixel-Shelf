var express = require('express');
var router = express.Router();
var SQLite3Driver = require('../models/SQLite3Driver');

router.get('/', function (req, res, next) {
    res.render('retailers', {title: 'Pixel Shelf'});
});

router.get('/:retailerId', function (req, res, next) {
    const retailerId = req.params.retailerId;
    SQLite3Driver.getRetailer(retailerId).then(result => {
        if (result && result.constructor === Object && Object.keys(result).length === 0) {
            res.status(404);
            res.render('404', {title: 'Pixel Shelf', type: 'retailer'});
        } else {
            res.render('entry/retailer', {
                title: result.retailer + ' - Pixel Shelf',
                entry: result,
                id: retailerId
            });
        }
    }).catch(err => {
        res.render('error', {message: "Error", error: err});
    });
});

module.exports = router;
