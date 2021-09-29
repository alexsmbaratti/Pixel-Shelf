const pixelShelf = require("../app");
const supertest = require("supertest");

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