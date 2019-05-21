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
  if (!req.session['num']) {
    req.session['num'] = 10;
  } else {
    req.session['num']++;
  }

  // req.session['num'] = 10;
  //
  // res.send(`欢迎你第${req.session['view']}到访本站，你的余额是：${req.session['num']}`);
  res.send(`ok${req.session['num']}`);
});

// cnpm i cookie-session -D
// session 不单独存在，会有标识。sessionId&token存在cookie中
// 默认强制加密
// session是存在服务器的。文件中，但是读写比较耗性能。也可以保存redis 内存 数据库中
// 如mysql-session

// 客户端浏览器访问服务器的时候，服务器把客户端信息以某种形式记录在服务器上，这就是session。客户端浏览器再次访问时只需要从该Session中查找该客户的状态就可以了。
// 如果说Cookie机制是通过检查客户身上的“通行证”来确定客户身份的话，那么session机制就是通过检查服务器上的“客户明细表”来确认客户身份。
// session相当于程序在服务器上建立的一份客户档案，客户来访的时候只需要查询客户档案表就可以了。
// 两者的区别：
// cookie数据存放在客户的浏览器上，session数据放在服务器上。
// cookie不是很安全，别人可以分析存放在本地的COOKIE并进行COOKIE欺骗 考虑到安全应当使用session。
// session会在一定时间内保存在服务器上。当访问增多，会比较占用你服务器的性能 考虑到减轻服务器性能方面，应当使用COOKIE。
// 单个cookie保存的数据不能超过4K，很多浏览器都限制一个站点最多保存20个cookie。
// 所以建议：将登陆信息等重要信息存放为session、其他信息如果需要保留，可以放在cookie中