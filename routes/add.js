var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('add', { title: 'Pixel Shelf' });
});

router.get('/mass', function(req, res, next) {
  res.render('mass', { title: 'Pixel Shelf' });
});

module.exports = router;
