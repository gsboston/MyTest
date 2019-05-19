const express=require('express');

let server=express();
server.listen(8080);

//
server.get('/a', (req, res, next)=>{
  console.log(req.query);
  res.send('aaa');
});
