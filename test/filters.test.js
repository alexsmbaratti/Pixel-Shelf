const pixelShelf = require("../app");
const supertest = require("supertest");

const SQLite3Driver = require("../models/SQLite3Driver");

beforeEach(done => {
    let driver = new SQLite3Driver();
    driver.initializeDB().then(() => {
        driver.initializeDB('./models/testdata.sql').then(() => {
            done();
        })
    })
});

test('No Filters', () => {
    return supertest(pixelShelf)
        .get('/api/library?sortBy=title&filters=[]')
        .expect(200)
        .then(response => {
            let library = response['body']['library'];
            expect(library.length).toBe(3);
        });
});

test('Only Digital Titles', () => {
    return supertest(pixelShelf)
        .get('/api/library?sortBy=title&filters=[not-physical]')
        .expect(200)
        .then(response => {
            let library = response['body']['library'];
            expect(library.length).toBe(1);
        });
});

test('Only Physical Titles', () => {
    return supertest(pixelShelf)
        .get('/api/library?sortBy=title&filters=[not-digital]')
        .expect(200)
        .then(response => {
            let library = response['body']['library'];
            expect(library.length).toBe(2);
        });
});