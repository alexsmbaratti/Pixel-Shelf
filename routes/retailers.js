var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('retailers', {title: 'Pixel Shelf'});
});

router.get('/:retailerId', function (req, res, next) {
    res.status(501);
    res.render('error', {
        status: 501,
        message: 'This page has not been implemented yet but is planned to be added in a future build.'
    });
});

module.exports = router;
