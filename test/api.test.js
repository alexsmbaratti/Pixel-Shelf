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

test('Library Size', () => {
    return supertest(pixelShelf)
        .get("/api/library/size")
        .expect(200)
        .then(response => {
            let librarySize = response['body']['size'];
            expect(librarySize).toBe(EXPECTED_LIBRARY_SIZE);
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