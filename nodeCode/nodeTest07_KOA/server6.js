const Koa=require('koa');
const Router=require('koa-router');
const path=require('path');

let server=new Koa();
server.listen(8080);

server.context.a=12;



//
let router=new Router();

router.get('/user', async ctx=>{
});

server.use(router.routes());
