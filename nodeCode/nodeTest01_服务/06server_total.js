const http = require('http');
const url = require('url');
const querystring = require('querystring');
const fs = require('fs');

let user = {};
let allowOrigin = {
    "http://127.0.0.1:8080": true
};

let server = http.createServer((req, res) => {
    let { origin } = req.headers.origin;
    if (allowOrigin[origin]) {
        res.setHeader('access-control-allow-origin', '*');
    }
    let post = {}, get = {}, path = "";

    if (req.method == 'GET') {
        let { pathname, query } = url.parse(req.url, true);
        get = query;
        path = pathname;
        complete();
    } else if (req.method == 'POST') {
        path = req.url;
        let arr = [];

        req.on('data', (buffer) => {
            arr.push(buffer);
        })

        req.on('end', () => {
            let buffer = Buffer.concat(arr);
            post = querystring.parse(buffer.toString());
            complete();
        })
    }

    function complete() {
        if (path == '/reg') {
            let { name, pwd } = get;
            if (user[name]) {
                res.write(JSON.stringify({ error: 1, msg: 'name exited' }));
            } else {
                user[name] = pwd;
                res.write(JSON.stringify({ error: 0, msg: 'reg success' }));
            }
            res.end();
        } else if (path == '/login') {
            let { name, pwd } = post;
            if (!user[name]) {
                res.write(JSON.stringify({ error: 1, msg: 'name not found' }));
            } else if (user[name] != pwd) {
                res.write(JSON.stringify({ error: 1, msg: 'pwd wrong' }));
            } else {
                res.write(JSON.stringify({ error: 0, msg: 'welcome back' }));
            }
            res.end();
        } else {
            fs.readFile(`resource${path}`, (err, buffer) => {
                if (err) {
                    res.writeHead(404);
                    res.write('NOT FOUND');
                } else {
                    res.write(buffer);
                }
                res.end();
            })
        }
    }

}).listen(8080);