var express = require('express');
var router = express.Router();
var SQLite3Driver = require('../models/SQLite3Driver');
var IGDBDriver = require('../models/IGDBDriver');
const axios = require('axios');

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

router.get('/:gameId/cover', function (req, res, next) {
    let driver = new SQLite3Driver();
    const gameId = req.params.gameId;
    driver.getGame(gameId).then(result => {
        coverArtExists(gameId, req).then(exists => {
            if (!exists) {
                if (result.igdbURL != null) { // Cache the IGDB cover
                    let igdbDriver = new IGDBDriver();
                    igdbDriver.getCoverByURL(result.igdbURL, gameId).then(igdbRes => {
                        res.redirect('/images/covers/' + gameId + '.jpg');
                    }).catch(err => {
                        console.log(err);
                        res.redirect('/images/covers/placeholder.jpg');
                    });
                } else { // No IGDB link
                    res.redirect('/images/covers/placeholder.jpg');
                }
            } else { // Art is already cached or user-uploaded
                res.redirect('/images/covers/' + gameId + '.jpg');
            }
        }).catch(err => {
            console.log(err);
            res.redirect('/images/covers/placeholder.jpg');
        });
    }).catch(err => {
        console.log(err);
        res.redirect('/images/covers/placeholder.jpg');
    });
});

function coverArtExists(id, req) {
    return new Promise(function (resolve, reject) {
        axios.get(`${req.protocol}://${req.get('host')}/images/covers/${id}.jpg`)
            .then(response => {
                resolve(true);
            })
            .catch(err => {
                if (err.response.status == 404) {
                    resolve(false);
                } else {
                    reject(err);
                }
            });
    });
}

module.exports = router;
