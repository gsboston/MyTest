const fs=require('fs');

let rs=fs.createReadStream('demo.jpg');
let ws=fs.createWriteStream('demo.copy.txt');

rs.pipe(ws);

rs.on('error', err=>{
  console.log(err);
});

ws.on('finish', ()=>{
  console.log('完成');
});
