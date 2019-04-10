//读写流
const fs=require('fs');
const zlib=require('zlib');

let rs=fs.createReadStream('1.txt');
let gz=zlib.createGzip();
let ws=fs.createWriteStream('1.txt.gz');

rs.pipe(gz).pipe(ws);

rs.on('error', err=>{
  console.log(err);
});

ws.on('finish', ()=>{
  console.log('完成');
});
