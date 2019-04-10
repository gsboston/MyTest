const express = require('express');
const cookieParser = require('cookie-parser');

let server = express();
server.listen(8080);

server.use(cookieParser());

server.get('/a', (req, res) => {
  console.log(req.cookies);

  // 写cookie
  // res.cookie('amount', 99.8, {
  //   // domain: 'aaa.com',//存储域名
  //   path: '/', //存储路径
  //   maxAge: 14 * 86400 * 1000
  // });

  res.send('ok');
});
