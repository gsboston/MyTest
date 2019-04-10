const http=require('http');
const zlib=require('zlib');
const url=require('url');
const fs=require('fs');

//res就是一个写入流
//req就是一个读取流
http.createServer((req, res)=>{
  let {pathname}=url.parse(req.url, true);
  let filepath='www'+pathname;

  fs.stat(filepath, (err, stat)=>{
    console.log(err);
    if(err){
      //deflate 需要返回buffer 二进制数据   Buffer.form()
      //res.setHeader('content-encoding', 'deflate');
      res.writeHeader(404);//setHeader只设置 writeHeader连设置带发送
      res.write('not found');
      res.end();
    }else{
      let rs=fs.createReadStream(filepath);
      rs.on('error', err=>{});//防止中途文件出错，不加服务器会报错
      res.setHeader('content-encoding', 'gzip');
      let gz=zlib.createGzip();
      rs.pipe(gz).pipe(res);
    }
  });
}).listen(8080);
