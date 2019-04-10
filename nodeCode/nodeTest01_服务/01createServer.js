const http = require('http');

let server = http.createServer(function (req, res) {
    console.log('qing qiu lai le');
})

server.listen(8080);