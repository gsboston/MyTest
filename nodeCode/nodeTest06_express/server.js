const express=require('express');

let server=express();
server.listen(8080);

//
server.get('/a', (req, res, next)=>{
  console.log('a');

  req.usertype=5;

  throw new Error('aaaa');

  next();
});
server.get('/a', (req, res, next)=>{
  console.log(req.usertype);
});
