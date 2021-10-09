const pixelShelf = require("../app");
const supertest = require("supertest");
var jsdom = require("jsdom");
const {JSDOM} = jsdom;

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

test('Game Library Table Mapping', () => {
    return supertest(pixelShelf)
        .get("/library")
        .expect(200)
        .then((response) => {
            const document = new JSDOM(response.text).window.document;
            // TODO: Check each row of the table and compare with expected results
        });
});

test('Game Library Page', () => {
    return supertest(pixelShelf)
        .get("/library/1")
        .expect(200)
        .then((response) => {
            const document = new JSDOM(response.text).window.document;
            expect(document.body.getElementsByTagName('h1').item(0).textContent).toBe('A Game'); // Game
            expect(document.body.getElementsByTagName('h1').item(1).textContent).toBe('A Console'); // Console
            expect(document.body.getElementsByTagName('h1').item(2).textContent).toBe('Standard Edition'); // Edition
            expect(document.body.getElementsByTagName('td').item(0).textContent).toBe('January 1, 2021'); // Date Added
            expect(document.body.getElementsByTagName('td').item(1).textContent).toBe('New'); // Condition
            expect(document.body.getElementsByTagName('td').item(2).firstElementChild.firstElementChild.getAttribute('class')).toBe('fas fa-check'); // Has Box
            expect(document.body.getElementsByTagName('td').item(3).firstElementChild.firstElementChild.getAttribute('class')).toBe('fas fa-check'); // Has Manual
            expect(document.body.getElementsByTagName('td').item(4).textContent).toBe('000000000000'); // UPC
            expect(document.body.getElementsByTagName('td').item(5).textContent).toBe('59.99'); // MSRP
            expect(document.body.getElementsByTagName('td').item(6).textContent).toBe('39.99'); // Cost
            expect(document.body.getElementsByTagName('td').item(7).firstElementChild.firstElementChild.getAttribute('class')).toBe('fas fa-times'); // Gift
        });
});