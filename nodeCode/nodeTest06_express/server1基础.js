const express = require('express');

let server = express();
server.listen(8080);

// express自带路由
server.get('/a', (req, res, next) => {
  console.log('a');

  // next无法直接传参，将需要传递的值放在req上
  req.usertype = 5;

  // next可以将一个请求分几步完成，多级处理
  // 有利于中间件的使用
  next();
});
server.get('/a', (req, res, next) => {
  console.log(req.usertype);
  res.send('aaa');
});
