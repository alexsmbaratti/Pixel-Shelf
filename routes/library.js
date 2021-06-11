var express = require('express');
var router = express.Router();
var SQLite3Driver = require('../models/SQLite3Driver');

/* GET home page. */
router.get('/', function (req, res, next) {
    let driver = new SQLite3Driver();
    driver.getLibrary().then(result => {
        console.log(result);
        res.render('library', {title: 'Pixel Shelf', library: result});
    }).catch(err => {
        res.render('error', {error: err});
    });
});

router.get('/:libraryId', function (req, res, next) {
    let driver = new SQLite3Driver();
    driver.getLibraryGame(req.params.libraryId).then(result => {
        console.log(result);
        res.render('libraryentry', {title: result.title + ' - Pixel Shelf', entry: result, id: req.params.libraryId});
    }).catch(err => {
        res.render('error', {message: "Error", error: err});
    });
});

router.delete('/:libraryId', function (req, res, next) {
    let driver = new SQLite3Driver();
    driver.deleteGame(req.params.libraryId).then(result => {
        console.log(result);
        res.status(204).send({"status": 204});
    }).catch(err => {
        res.status(500).send({"status": 500});
    });
});

module.exports = router;
