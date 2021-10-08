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
    // TODO: Generate token
});

test('Index Page Loads', () => {
    return supertest(pixelShelf)
        .get("/")
        .expect(200);
});

test('Error 404 Loads', () => {
    return supertest(pixelShelf)
        .get("/obviously-not-a-page")
        .expect(404);
});