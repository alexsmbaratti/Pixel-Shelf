var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('amiibo', { title: 'Pixel Shelf' });
});

router.get('/:figureId', function (req, res, next) {
  res.status(501);
  res.render('error', {
    status: 501,
    message: 'This page has not been implemented yet but is planned to be added in a future build.'
  });
});

module.exports = router;
