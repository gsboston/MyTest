const http = require('http');
const url = require('url');
const querystring = require('querystring');
const fs = require('fs');
const zlib = require('zlib');
const { Form } = require('multiparty');
const router = require('./router');
const { ALLOW_ORIGIN, HTTP_PORT, HTTP_UPLOAD, HTTP_ROOT } = require('../config/index');

http.createServer((req, res) => {
    res.writeJson = function (json) {
        res.setHeader('content-type', 'application/json');
        res.write(JSON.stringify(json));
    };

    let { origin } = req.headers;
    if (ALLOW_ORIGIN[origin]) {
        res.setHeader('access-control-allow-origin', '*');
    }

    let { pathname, query } = url.parse(req.url, true);
    let method = req.method;

    if (method == 'POST') {
        if (req.headers['content-type'].startsWith('application/x-www-form-urlencoded')) {
            //普通post
            let arr = [];
            req.on('data', buffer => {
                arr.push(buffer);
            })

            req.on('end', () => {
                let post = querystring.parse(Buffer.concat(arr).toString());
                handle(method, pathname, query, post, {});
            })
        } else {
            //formdata post
            let form = new Form({
                uploadDir: HTTP_UPLOAD
            })

            form.parse(req);
            let post = {};
            let files = {};

            form.on('field', (name, value) => {
                post[name] = value;
            });

            form.on('file', (name, file) => {
                files[name] = file;
            });

            form.on('error', (e) => {
                console.log(e);
            });

            form.on('close', () => {
                handle(method, pathname, query, post, files);
            })
        }
    } else if (method == 'GET') {
        handle(method, pathname, query, {}, {});
    }

    async function handle(method, url, get, post, files) {
        let fn = router.findRouter(method, url);

        if (!fn) {//请求文件
            let filePath = HTTP_ROOT + pathname;
            fs.stat(filePath, (err, stat) => {
                if (err) {
                    res.writeHead(404);
                    res.write('not found');
                    res.end();
                } else {
                    let ws = fs.createReadStream(filePath);
                    let gz = zlib.createGzip();

                    ws.on('error', () => { });
                    res.setHeader('content-encoding', 'gzip');
                    ws.pipe(gz).pipe(res);
                }
            });
        } else {//请求接口
            try {
                // 异步函数，try-catch无法捕获
                await fn(res, get, post, files);
            } catch (e) {
                console.log(e);
                res.writeHeader(500);
                res.write('Internal Server Error');
                res.end();
            }
        }
    }

}).listen(HTTP_PORT);

console.log(`server start on ${HTTP_PORT}`);