const pixelShelf = require("../app");
const supertest = require("supertest");
var jsdom = require("jsdom");
const {JSDOM} = jsdom;

const SQLite3Driver = require("../models/SQLite3Driver");

jest.setTimeout(20000);

beforeEach(done => {
    SQLite3Driver.initializeDB().then(() => {
        SQLite3Driver.initializeDB('./models/testdata.sql').then(() => {
            done();
        });
    });
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

test('Game Library Page', () => {
    return supertest(pixelShelf)
        .get("/library/1")
        .expect(200)
        .then((response) => {
            const documentBody = new JSDOM(response.text).window.document.body;
            expect(documentBody.getElementsByTagName('h1').item(0).textContent).toBe('A Game'); // Game
            expect(documentBody.getElementsByTagName('h1').item(1).textContent).toBe('A Console'); // Console
            expect(documentBody.getElementsByTagName('h1').item(2).textContent).toBe('Standard Edition'); // Edition
            expect(documentBody.getElementsByTagName('td').item(0).textContent).toBe('January 1, 2021'); // Date Added
            expect(documentBody.getElementsByTagName('td').item(1).textContent).toBe('New'); // Condition
            expect(documentBody.getElementsByTagName('td').item(2).firstElementChild.firstElementChild.getAttribute('class')).toBe('fas fa-check'); // Has Box
            expect(documentBody.getElementsByTagName('td').item(3).firstElementChild.firstElementChild.getAttribute('class')).toBe('fas fa-check'); // Has Manual
            expect(documentBody.getElementsByTagName('td').item(4).textContent).toBe('000000000000'); // UPC
            expect(documentBody.getElementsByTagName('td').item(5).textContent).toBe('59.99'); // MSRP
            expect(documentBody.getElementsByTagName('td').item(6).textContent).toBe('39.99'); // Cost
            expect(documentBody.getElementsByTagName('td').item(7).firstElementChild.firstElementChild.getAttribute('class')).toBe('fas fa-times'); // Gift
        });
});

test('Platform Page', () => {
    return supertest(pixelShelf)
        .get("/platforms/1")
        .expect(200)
        .then((response) => {
            const documentBody = new JSDOM(response.text).window.document.body;
            expect(documentBody.getElementsByTagName('h1').item(0).textContent).toBe('A Console'); // Console
            expect(documentBody.getElementsByTagName('h1').item(1).textContent).toBe('A Brand'); // Brand
        });
});