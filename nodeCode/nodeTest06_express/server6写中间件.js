const express=require('express');
const body=require('./libs/body-parser');

let server=express();
server.listen(8080);

// libs/body-parser.js
server.use(body.urlencoded());

//
server.post('/reg', (req, res)=>{
  console.log(req.body);
});
