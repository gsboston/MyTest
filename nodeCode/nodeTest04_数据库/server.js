const http = require('http');
const mysql = require('mysql');

//1.链接到服务器
let db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Gs12345678',
    socketPath: '/tmp/mysql.sock',
    database: '20190327db'
});

db.query('SELECT * FROM user_table', (err, data) => {
    if (err) {
        console.log('error:', err);
    } else {
        console.log(data);
    }
});