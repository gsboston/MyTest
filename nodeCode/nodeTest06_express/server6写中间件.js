const express = require('express');
const body = require('./libs/body-parser');

let server = express();
server.listen(8080);

// libs/body-parser.js
server.use(body.urlencoded());

server.post('/reg', (req, res) => {
  console.log(req.body);

  res.send('ok');
});


server.use(express.static('./'));

// server.use('/abc', (req, res, next) => {
//   console.log(111);
//   next();
// })

// server.get('/abc', (req, res, next) => {
//   console.log(222);
//   res.send('ok');
// });