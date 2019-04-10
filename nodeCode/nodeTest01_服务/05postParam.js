const http = require('http');
const querystring = require('querystring');

let server = http.createServer((req, res) => {
    let arr = [];
    // post参数需要多次传输，所以需要监听data。获取到的值是buffer，添加到数组中保存
    req.on('data', (buffer) => {
        arr.push(buffer);
    });

    // 所有参数传输完毕执行end事件
    req.on('end', () => {
        // Buffer.concat 将数组中的buffer合并
        let buffer = Buffer.concat(arr);
        // buffer.toString() 的值就是get的参数形式
        console.log(buffer.toString());
        let param = querystring.parse(buffer.toString());
        console.log(param);
    })
});

server.listen(8080);