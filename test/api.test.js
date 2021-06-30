const axios = require('axios');
const API_URL = 'http://localhost:3000/api';

test('API is online', () => {
    return axios({
        method: 'get',
        url: API_URL
    }).then(result => {
        expect(result["data"]).toStrictEqual({"status": 200});
    });
});