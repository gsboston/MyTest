const express = require('express');

let server = express();
server.listen(8080);


server.get('/a', (req, res, next) => {
  // 通过req.query就可以拿到get请求的参数
  console.log(req.query);
  console.log(__dirname);
  res.send('aaa');
});
