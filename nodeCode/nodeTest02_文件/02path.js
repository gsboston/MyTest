const path = require('path');

let str = '/root/a/b/1.js';

path.dirname(str);//  /root/a/b
path.extname(str);//  .js
path.basename(str);// 1.js
path.resolve('/root/a/b','../c','build','..','script'); // /root/a/c/script
__dirname; //魔术变量，当前目录