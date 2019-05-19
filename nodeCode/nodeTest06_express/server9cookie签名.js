const express = require('express');
const cookieParser = require('cookie-parser');

let server = express();
server.listen(8080);

// 密钥
server.use(cookieParser(
  'fasdgfhsrtyredfbfd56te5645sdter76tytutyi456ythgfgerrhdfghfdg'
));


server.get('/a', (req, res) => {
  console.log('cookie:', req.cookies);         //未签名的cookie
  console.log('signed:', req.signedCookies);   //签名的cookie

  // 设置cookie
  // res.cookie('amount', 99.8, {
  //   //httpOnly: true,   // 只能由服务器操作，前台看不到
  //   maxAge: 14*86400*1000,
  //   //secure: true,         // 只有https情况下才能使用cookie
  //   signed: true            // 是否签名
  // });

  res.send('ok');
});


// 签名：
// s:99.8.Tal7fIJ2XOtDac3lVhJNEONm3De97RXTHjrEeci7TvQ
// s:值.签名

// cookie大小不超过4k，签名增加安全性，但是增大体积
// 只签名重要的信息