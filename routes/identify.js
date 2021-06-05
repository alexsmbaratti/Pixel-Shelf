var express = require('express');
var router = express.Router();
var SQLite3Driver = require('../models/SQLite3Driver');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('identify', { title: 'Pixel Shelf' });
});

router.post('/', function (req, res) {
  let driver = new SQLite3Driver();
  console.log(req.body);
  driver.lookupByUPC(req.body.upc).then(result => {
    if (result != undefined) {
      res.status(200).send({"status": 200, "data": result});
    } else {
      res.status(500).send({"status": 500});
    }
  }).catch(err => {
    res.status(500).send({"status": 500});
  });
});

module.exports = router;
