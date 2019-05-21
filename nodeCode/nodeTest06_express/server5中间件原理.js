const express = require('express');

let server = express();
server.listen(8080);

const querystring = require('querystring');

// 代码按顺利执行，所以这里可以拦截所有请求
server.use((req, res, next) => {
  let arr = [];
  req.on('data', buffer => {
    arr.push(buffer);
  });
  req.on('end', () => {
    let post = querystring.parse(Buffer.concat(arr).toString());

    req.body = post;
    next();
  });
});

//
server.post('/reg', (req, res) => {
  console.log(req.body);
});