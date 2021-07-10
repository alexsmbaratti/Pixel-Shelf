var express = require('express');
var router = express.Router();
const version = require('../package.json').version;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Pixel Shelf' });
});

router.get('/backend', function(req, res, next) {
  res.render('backend', { title: 'Pixel Shelf', version: version });
});

router.get('/export', function(req, res, next) {
  res.render('export', { title: 'Pixel Shelf' });
});

module.exports = router;
