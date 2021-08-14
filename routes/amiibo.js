var express = require('express');
var router = express.Router();
var SQLite3Driver = require('../models/SQLite3Driver');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('amiibo', { title: 'Pixel Shelf' });
});

router.get('/:figureId', function (req, res, next) {
  let driver = new SQLite3Driver();
  const figureId = req.params.figureId;
  driver.getFigure(figureId).then(result => {
    if (result && result.constructor === Object && Object.keys(result).length === 0) {
      res.status(404);
      res.render('404', {title: 'Pixel Shelf', type: 'amiibo'});
    } else {
      console.log(result)
      res.render('entry/figure', {
        title: result.title + ' - Pixel Shelf',
        entry: result,
        id: figureId
      });
    }
  }).catch(err => {
    res.render('error', {message: "Error", error: err});
  });
});
module.exports = router;
