const express = require('express');
const body = require('body-parser');

let server = express();
server.listen(8080);

// 在路由之前添加中间件
server.use(body.urlencoded({
  extended: false // 是否开启扩展模式
}));

server.post('/reg', (req, res) => {
  // 加了中间件后，req上会多出一个body
  let { name, pwd } = req.body;
  console.log(name, pwd);
  res.send('ok');
});

// body-parser 中间件
// cnpm i body-parse -D