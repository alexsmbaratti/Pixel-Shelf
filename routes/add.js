var express = require('express');
var router = express.Router();
var SQLite3Driver = require('../models/SQLite3Driver');

/* GET home page. */
router.get('/', function(req, res, next) {
  let driver = new SQLite3Driver();
  driver.getPlatforms().then(result => {
    console.log(result);
    res.render('add', { title: 'Pixel Shelf', platforms: result });
  }).catch(err => {
    res.render('error', {error: err});
  });
});

router.post('/', function (req, res) {
  console.log(req.body);
});

router.get('/mass', function(req, res, next) {
  res.render('mass', { title: 'Pixel Shelf' });
});

module.exports = router;
