const pixelShelf = require("../app");
const supertest = require("supertest");

const SQLite3Driver = require("../models/SQLite3Driver");

beforeEach(done => {
    SQLite3Driver.initializeDB().then(() => {
        SQLite3Driver.initializeDB('./models/testdata.sql').then(() => {
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

test('Filter Physical Titles', () => {
    return supertest(pixelShelf)
        .get('/api/library?sortBy=title&filters=[not-physical]')
        .expect(200)
        .then(response => {
            let library = response['body']['library'];
            expect(library.length).toBe(1);
        });
});

test('Filter Digital Titles', () => {
    return supertest(pixelShelf)
        .get('/api/library?sortBy=title&filters=[not-digital]')
        .expect(200)
        .then(response => {
            let library = response['body']['library'];
            expect(library.length).toBe(2);
        });
});

test('Filter Physical and Digital Titles', () => {
    return supertest(pixelShelf)
        .get('/api/library?sortBy=title&filters=[not-physical,not-digital]')
        .expect(200)
        .then(response => {
            let library = response['body']['library'];
            expect(library.length).toBe(0);
        });
});

test('Filter New Titles', () => {
    return supertest(pixelShelf)
        .get('/api/library?sortBy=title&filters=[not-new]')
        .expect(200)
        .then(response => {
            let library = response['body']['library'];
            expect(library.length).toBe(0);
        });
});

test('Filter Used Titles', () => {
    return supertest(pixelShelf)
        .get('/api/library?sortBy=title&filters=[not-used]')
        .expect(200)
        .then(response => {
            let library = response['body']['library'];
            expect(library.length).toBe(3);
        });
});

test('Filter New and Used Titles', () => {
    return supertest(pixelShelf)
        .get('/api/library?sortBy=title&filters=[not-new,not-used]')
        .expect(200)
        .then(response => {
            let library = response['body']['library'];
            expect(library.length).toBe(0);
        });
});