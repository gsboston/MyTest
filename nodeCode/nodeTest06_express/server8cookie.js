const express = require('express');
const cookieParser = require('cookie-parser');

let server = express();
server.listen(8080);

server.use(cookieParser());

server.get('/index', (req, res) => {
  // 添加中间件后可以使用req上的cookies
  console.log(req.cookies);

  // 写cookie
  // res.cookie('num', 10, {
  //   // domain: 'aaa.com',//存储域名
  //   // path: '/', //存储路径
  //   maxAge: 24 * 3600 * 1000
  // });

  res.send('ok');
});

// cnpm i cookie-parser -D

// cookie：存储在浏览器，请求服务器的时候，会顺便发给服务器
//   不安全的

// session：存储在服务器，不是独立的，基于cookie
//   安全问题：session劫持
//   缩短有效期

//   （存在cookie里的session-ID）->token

// cookie不跨域

// www.baidu.com -> baidu.com
// baidu.com -x> www.baidu.com

// 一般设置主域名，避免子域名访问不到cookie
// domain: 'baidu.com'

// /user   =>    /
// /       =x>   /user

// 一般设置保存到跟路径下，
// path: '/'