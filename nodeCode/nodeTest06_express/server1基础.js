const express = require('express');

let server = express();
server.listen(8080);

// express自带路由
server.get('/a', (req, res, next) => {
  console.log('a');

  // 通过next传参
  req.usertype = 5;

  // throw new Error('aaaa');

  // next可以将一个请求分几步完成，多级处理
  // 有利于中间件的使用
  next();
});
server.get('/a', (req, res, next) => {
  console.log(req.usertype);
  res.send('aaa');
});
