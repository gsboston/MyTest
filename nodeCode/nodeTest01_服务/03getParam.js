const http = require('http');
// querystring专门处理参数，如 a=1&b=2 格式。
const querystring = require('querystring');

let server = http.createServer((req, res) => {
    let [path, param] = req.url.split('?');
    let get = querystring.parse(param);
    console.log(`url:${path}`);
    console.log(get);
})

server.listen(8080);