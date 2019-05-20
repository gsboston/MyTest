const express = require('express');
const cookieSession = require('cookie-session');

let server = express();
server.listen(8080);

// 循环密钥更安全
server.use(cookieSession({
  keys: ['asdfwqw4r4r343fdgsdfg', 'safdas454trgtrthdfthd', 'dfsdfgdfyrt6u6t7yit7u'],
  maxAge: 20 * 60 * 1000      //20分钟
}));

//
server.get('/index', (req, res) => {
  console.log(req.session);
  // if (!req.session['view']) {
  //   req.session['view'] = 1;
  // } else {
  //   req.session['view']++;
  // }

  req.session['num'] = 10;
  //
  // res.send(`欢迎你第${req.session['view']}到访本站，你的余额是：${req.session['num']}`);
  res.send('ok');
});

// cnpm i cookie-session -D
// session 不单独存在，会有标识。sessionId&token存在cookie中
// 默认强制加密
// session是存在服务器的。文件中，但是读写比较耗性能。也可以保存redis 内存 数据库中
// 如mysql-session