const http = require('http');
//url 处理完整的url，从中取出地址和参数
const url = require('url');

let server = http.createServer((req, res) => {
    let { pathname, query } = url.parse(req.url, true);

    console.log(pathname, query);
})

server.listen(8080);