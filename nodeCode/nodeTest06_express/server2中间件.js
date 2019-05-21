const express = require('express');

let server = express();
server.listen(8080);


server.get('/a', (req, res, next) => {
  res.send('aaa');
});
server.get('/b', (req, res, next) => {
  res.send('bbb');
});

// 处理文件请求，static是express自带的，但是绝大多数中间件都不是自带的，需要下载安装
// server.use使用中间件
// 一般放到最后，因为路由从上向下执行，如果有接口与文件同名，就不会走到接口
server.use(express.static('./static/'));
