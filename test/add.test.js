const pixelShelf = require("../app");
const supertest = require("supertest");

const SQLite3Driver = require('../models/SQLite3Driver');

var consoleID = null;
var gameID = null;
var editionID = null;
var retailerID = null;

beforeAll(done => {
    SQLite3Driver.initializeDB().then(() => {
        SQLite3Driver.initializeDB('./models/testdata.sql').then(() => {
            done();
        })
    })
});

test('Add a new platform AND brand', () => {
    return supertest(pixelShelf)
        .post('/api/consoles')
        .send({
            "name": "My Amazing Console",
            "brand": "Pixel Shelf Industries"
        })
        .expect(200)
        .then(response => {
            consoleID = response['body']['id'];
        });
});

test('Add a new platform', () => {
    return supertest(pixelShelf)
        .post('/api/consoles')
        .send({
            "name": "My New Amazing Console",
            "brand": "Pixel Shelf Industries"
        })
        .expect(200);
});

test('Add a new online retailer', () => {
    return supertest(pixelShelf)
        .post('/api/retailers')
        .send({
            "retailer": "The Video Game Store",
            "online": true,
            "url": "https://www.example.com/"
        })
        .expect(200);
});

test('Add a new brick and mortar retailer', () => {
    return supertest(pixelShelf)
        .post('/api/retailers')
        .send({
            "retailer": "The Video Game Store",
            "subtext": "Anytown Location",
            "online": false,
            "lat": 30.000,
            "long": -70.000
        })
        .expect(200)
        .then(response => {
            retailerID = response['body']['id'];
        });
});

test('Add a new game', () => {
    return supertest(pixelShelf)
        .post('/api/games')
        .send({
            "title": "My Amazing Game",
            "platform": consoleID
        })
        .expect(200)
        .then(response => {
            gameID = response['body']['id'];
        });
});

test('Add a new edition', () => {
    return supertest(pixelShelf)
        .post('/api/editions')
        .send({
            "edition": "Standard Edition",
            "upc": "1234567890",
            "msrp": "59.99",
            "digital": false,
            "currency": "USD",
            "gameID": gameID
        })
        .expect(200)
        .then(response => {
            editionID = response['body']['id'];
        });
});

test('Add a new library entry', () => {
    return supertest(pixelShelf)
        .post('/api/library')
        .send({
            "cost": "39.99",
            "timestamp": new Date(Date.now()).toISOString(),
            "condition": true,
            "box": true,
            "manual": false,
            "retailerID": retailerID,
            "gift": false,
            "notes": "Test",
            "currency": 'USD',
            "editionID": editionID
        })
        .expect(200);
});

test('Add a new wishlist entry', () => {
    return supertest(pixelShelf)
        .post('/api/library')
        .send({
            "editionID": editionID
        })
        .expect(200);
});

test('Add a new series', () => {
    return supertest(pixelShelf)
        .post('/api/series')
        .send({
            "series": "My Amazing Series"
        })
        .expect(200);
});