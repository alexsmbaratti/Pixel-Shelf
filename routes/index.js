var express = require('express');
var router = express.Router();
const version = require('../package.json').version;

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Pixel Shelf'});
});

router.get('/backend', function (req, res, next) {
    res.render('backend', {title: 'Pixel Shelf', version: version});
});

router.get('/export', function (req, res, next) {
    res.render('export', {title: 'Pixel Shelf'});
});

router.get('/privacy-policy', function (req, res, next) {
    res.status(501);
    res.render('error', {
        status: 501,
        message: 'This page has not been implemented yet but is planned to be added in a future build.'
    });
});


module.exports = router;
