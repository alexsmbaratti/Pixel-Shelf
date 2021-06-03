var express = require('express');
var router = express.Router();
var SQLite3Driver = require('../models/SQLite3Driver');

/* GET home page. */
router.get('/', function(req, res, next) {
  let driver = new SQLite3Driver();
  driver.getLibrary();
  res.render('library', { title: 'Pixel Shelf' });
});

module.exports = router;
