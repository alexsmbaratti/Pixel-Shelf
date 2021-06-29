var express = require('express');
var router = express.Router();
var SQLite3Driver = require('../models/SQLite3Driver');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('wishlist', { title: 'Pixel Shelf' });
});

router.get('/games', function (req, res, next) {
  let driver = new SQLite3Driver();
  driver.getWishlist(req.query.sortBy).then(result => {
    res.status(200).send({"status": 200, "library": result});
  }).catch(err => {
    res.status(500).send({"status": 500});
  });
});

module.exports = router;
