const path = require('path');

module.exports = {
    DB_HOST: 'localhost',
    DB_PORT: 3306,
    DB_USER: 'root',
    DB_PASS: 'Gs12345678',
    DB_NAME: '20190327db',

    HTTP_PORT: '8080',
    HTTP_ROOT: path.resolve(__dirname + '../static/'),
    HTPP_UPLOAD: path.resolve(__dirname + '../static/upload/'),
    ALLOW_ORIGIN: {
        'http://127.0.0.1:5500': true
    }
};