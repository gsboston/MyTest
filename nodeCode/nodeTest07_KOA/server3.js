const Koa=require('koa');
const Router=require('koa-router');

let server=new Koa();
server.listen(8080);

//
let router=new Router();


router.get('/news/', async ctx=>{
  let {id}=ctx.query;
  console.log(ctx.query);

  ctx.body='bbb';
});

server.use(router.routes());
