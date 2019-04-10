const express=require('express');

let server=express();
server.listen(8080);

//
server.get('/a', (req, res, next)=>{
  res.send('aaa');
});
server.get('/b', (req, res, next)=>{
  res.send('bbb');
});

//
server.use(express.static('./static/'));
