const axios = require('axios');
const API_URL = 'http://localhost:3000/api';

var consoleIDs = [];

test('API is online', () => {
    return axios({
        method: 'get',
        url: API_URL
    }).then(result => {
        expect(result['data']['status']).toStrictEqual(200);
    });
});

test('Add a new platform AND brand', () => {
    return axios({
        method: 'post',
        url: API_URL + `/consoles`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            "name": "My Amazing Console",
            "brand": "Pixel Shelf Industries"
        }
    }).then(result => {
        consoleIDs.push(result['data']['id']);
        expect(result['data']['status']).toStrictEqual(200);
    });
});

test('Add a new platform', () => {
    return axios({
        method: 'post',
        url: API_URL + `/consoles`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            "name": "My New Amazing Console",
            "brand": "Pixel Shelf Industries"
        }
    }).then(result => {
        consoleIDs.push(result['data']['id']);
        expect(result['data']['status']).toStrictEqual(200);
    });
});

test('Add a new online retailer', () => {
    return axios({
        method: 'post',
        url: API_URL + `/retailers`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            "retailer": "The Video Game Store",
            "online": true,
            "url": "https://www.example.com/"
        }
    }).then(result => {
        expect(result['data']['status']).toStrictEqual(200);
    });
});

test('Add a new brick and mortar retailer', () => {
    return axios({
        method: 'post',
        url: API_URL + `/retailers`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            "retailer": "The Video Game Store",
            "subtext": "Anytown Location",
            "online": false,
            "lat": 30.000,
            "long": -70.000
        }
    }).then(result => {
        expect(result['data']['status']).toStrictEqual(200);
    });
});