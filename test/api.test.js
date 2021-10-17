const pixelShelf = require("../app");
const supertest = require("supertest");

const SQLite3Driver = require('../models/SQLite3Driver');

const EXPECTED_LIBRARY_SIZE = 6;

beforeEach(done => {
    SQLite3Driver.initializeDB().then(() => {
        SQLite3Driver.initializeDB('./models/testdata.sql').then(() => {
            done();
        })
    })
});

test('API is reachable', () => {
    return supertest(pixelShelf)
        .get("/api")
        .expect(200);
});

test('Database is reachable', () => {
    return supertest(pixelShelf)
        .get("/api/db")
        .expect(200);
});

test('IGDB is reachable', () => {
    return supertest(pixelShelf)
        .get("/api/igdb")
        .expect(200);
});

test('Platform Endpoint', () => {
    return supertest(pixelShelf)
        .get("/api/system/platform")
        .expect(200);
});

test('Database Stats Endpoint', () => {
    return supertest(pixelShelf)
        .get("/api/db/stats")
        .expect(200);
});

test('Library Size', () => {
    return supertest(pixelShelf)
        .get("/api/library/size")
        .expect(200)
        .then(response => {
            let librarySize = response['body']['size'];
            expect(librarySize).toBe(EXPECTED_LIBRARY_SIZE);
        });
});

test('Get Library Entry', () => {
    return supertest(pixelShelf)
        .get("/api/library/1")
        .expect(200)
        .then(response => {
            let libraryEntry = response['body']['data'];
            expect(libraryEntry['title']).toBe('A Game');
            expect(libraryEntry['platform']).toBe('A Console');
            expect(libraryEntry['cost']).toBe(39.99);
            expect(libraryEntry['msrp']).toBe(59.99);
            expect(libraryEntry['upc']).toBe('000000000000');
            expect(libraryEntry['edition']).toBe('Standard Edition');
            expect(libraryEntry['new']).toBe(true);
            expect(libraryEntry['box']).toBe(true);
            expect(libraryEntry['manual']).toBe(true);
            expect(libraryEntry['gift']).toBe(false);
            expect(libraryEntry['digital']).toBe(false);
            expect(libraryEntry['igdbURL']).toBe('http://example.com/platforms/a-console');
            expect(libraryEntry['date']).toBe('2021-01-01T00:00:00.000Z');
            expect(libraryEntry['retailerID']).toBe(1);
            expect(libraryEntry['progress']).toBe(3);
        });
});

test('Sample Cached Metadata', () => {
    return supertest(pixelShelf)
        .get("/api/games/1/igdb")
        .expect(200)
        .then(response => {
            let metadata = response['body']['data'];
            expect(metadata['description']).toBe('This is a game.');
            expect(metadata['coverURL']).toBe(null);
            expect(metadata['releasedate']).toBe(null);
            expect(metadata['igdbURL']).toBe('http://example.com/games/a-game');
            // TODO: Handle ratings and genres
        });
});

test('Lookup By UPC', () => {
    return supertest(pixelShelf)
        .post("/identify")
        .send({
            "upc": "000000000050"
        })
        .expect(200)
        .then(response => {
            let result = response['body']['data'];
            expect(result['title']).toBe('B Game');
            expect(result['platform']).toBe('B Console');
            expect(result['edition']).toBe('Standard Edition');
            expect(result['upc']).toBe('000000000050');
            expect(result['msrp']).toBe(29.99);
        });
});