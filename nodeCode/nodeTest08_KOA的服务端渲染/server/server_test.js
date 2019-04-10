const fs = require('fs');
const afs = require('await-fs');
const Koa = require('koa');
const path = require('path');

let server = new Koa();
server.listen(8080);

server.use(async ctx => {
    let aa = JSON.parse(await afs.readFile(path.resolve(__dirname, 'admins.json')));
    console.log(aa);
    ctx.body = aa;
});