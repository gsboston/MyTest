const http = require('http');
const url = require('url');
const querystring = require('querystring');
const fs = require('fs');
const mysql = require('mysql');
const co = require('co-mysql');
const validator = require('../libs/validator');

let allowOrigin = {
    'http://127.0.0.1:5500': true
};

let conn = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Gs12345678',
    socketPath: '/tmp/mysql.sock',
    database: '20190327db'
});
let db = co(conn);

http.createServer((req, res) => {
    let { origin } = req.headers;
    if (allowOrigin[origin]) {
        res.setHeader('access-control-allow-origin', '*');
    }

    let post = {}, get = {}, path = '';
    if (req.method == 'GET') {
        let { pathname, query } = url.parse(req.url, true);
        get = query;
        path = pathname;
        complete();
    } else if (req.method == 'POST') {
        let arr = [];
        path = req.url;
        req.on('data', (buffer) => {
            arr.push(buffer);
        })
        req.on('end', () => {
            let buffer = Buffer.concat(arr);
            post = querystring.parse(buffer.toString());
            console.log(post);
            complete();
        })
    }

    async function complete() {
        if (path == '/reg') {
            let { name, pwd } = get;
            let errMsg = validator.username(name);
            if (errMsg) {
                res.write(JSON.stringify({ error: 1, msg: errMsg }));
            } else {
                errMsg = validator.password(pwd);
                if (errMsg) {
                    res.write(JSON.stringify({ error: 1, msg: errMsg }));
                } else {
                    try {
                        let data = await db.query(`SELECT * FROM user_info WHERE name='${name}'`);
                        if (data.length > 0) {
                            res.write(JSON.stringify({ error: 0, msg: '用户名存在' }));
                        } else {
                            let data2 = await db.query(`INSERT INTO user_info (name,pwd,address) VALUES ('${name}','${pwd}','beijing')`);
                            res.write(JSON.stringify({ error: 0, msg: '注册成功' }));
                        }
                    } catch (e) {
                        console.log('数据库出错');
                        // res.write(JSON.stringify({ error: 1, msg: '数据库出错' }));
                    }
                }
            }
            res.end();
        } else if (path == '/login') {
            let { name, pwd } = post;
            console.log(post,name,pwd);
            let errMsg = validator.username(name);
            if (errMsg) {
                res.write(JSON.stringify({ error: 1, msg: errMsg }));
            } else {
                errMsg = validator.password(pwd);
                if (errMsg) {
                    res.write(JSON.stringify({ error: 1, msg: errMsg }));
                } else {
                    try {
                        let data = await db.query(`SELECT * FROM user_info WHERE name='${name}'`);
                        if (data.length == 0) {
                            res.write(JSON.stringify({ error: 0, msg: '用户名不存在' }));
                        } else if (data[0].pwd != pwd) {
                            res.write(JSON.stringify({ error: 0, msg: '密码不正确' }));
                        } else {
                            res.write(JSON.stringify({ error: 0, msg: '登录成功' }));
                        }
                    } catch (e) {
                        console.log('数据库出错');
                        // res.write(JSON.stringify({ error: 1, msg: '数据库出错' }));
                    }
                }
            }
            res.end();
        } else {
            fs.readFile(`resource${path}`, (err, buffer) => {
                if (err) {
                    res.writeHead(404);
                    res.write('not found');
                } else {
                    res.write(buffer);
                }
                res.end();
            })
        }

    };

}).listen(8080);

































