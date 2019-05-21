const express = require('express');
const multer = require('multer');

let server = express();
server.listen(8080);

// 用法是中间件作者规定
// dest 指定文件上传路径
let obj = multer({ dest: './static/upload' });
server.use(obj.any());

server.post('/upload', (req, res) => {
  // 通过req.files 拿到上传的文件具体信息
  console.log(req.files);
  
  res.send('upload successed');
});

// cnpm i multer -D