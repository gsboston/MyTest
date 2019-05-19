const Koa = require('koa');
const Router = require('koa-router');

let server = new Koa();
server.listen(8080);

// server.context：相当于ctx的prototype(官方解释)
server.context.a = 12;
// 适合放一些全局的东西，如数据库链接等
// server.context.db=mysql.createPool();

//
let router = new Router();


router.get('/news/', async ctx => {
  let { id } = ctx.query;
  console.log(ctx.query);

  ctx.body = 'bbb' + ctx.a;
});

server.use(router.routes());
