var express = require('express');
var router = express.Router();
var SQLite3Driver = require('../models/SQLite3Driver');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('library', {
        title: 'Pixel Shelf',
        header: 'Game Library',
        jsSrc: '/js/library.js'
    });
});

router.get('/backlog', function (req, res, next) {
    res.render('library', {
        title: 'Pixel Shelf',
        header: 'Backlog',
        jsSrc: '/js/library/backlog.js'
    });
});

router.get('/playing', function (req, res, next) {
    res.render('library', {
        title: 'Pixel Shelf',
        header: 'Currently Playing',
        jsSrc: '/js/library/playing.js'
    });
});

router.get('/completed', function (req, res, next) {
    res.render('library', {
        title: 'Pixel Shelf',
        header: 'Completed',
        jsSrc: '/js/library/completed.js'
    });
});

router.get('/:libraryId', function (req, res, next) {
    let driver = new SQLite3Driver();
    const libraryId = req.params.libraryId;
    driver.getLibraryGame(libraryId).then(result => {
        if (result && result.constructor === Object && Object.keys(result).length === 0) {
            res.status(404);
            res.render('404', {title: 'Pixel Shelf', type: 'game'});
        } else {
            res.render('entry/library', {
                title: result.title + ' - Pixel Shelf',
                entry: result,
                id: libraryId,
                igdb: result.igdbURL
            });
        }
    }).catch(err => {
        res.render('error', {message: "Error", error: err});
    });
});

router.get('/:libraryId/edit', function (req, res, next) {
    let driver = new SQLite3Driver();
    const libraryId = req.params.libraryId;
    driver.getLibraryGame(libraryId).then(result => {
        res.render('edit/game', {
            title: result.title + ' - Pixel Shelf',
            entry: result,
            id: libraryId,
            igdb: result.igdbURL
        });
    }).catch(err => {
        res.render('error', {message: "Error", error: err});
    });
});



module.exports = router;
