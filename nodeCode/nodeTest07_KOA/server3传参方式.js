const Koa = require('koa');
const Router = require('koa-router');

let server = new Koa();
server.listen(8080);

//
let router = new Router();

// urlencoded  http://aaa.com/user?a=12&b=5
// 顺序灵活，可省略，不利于seo

// params      http://aaa.com/user/12/15
// 顺序死的，不可省，利于seo（搜索引擎对静态地址更感兴趣）

// urlencoded
router.get('/news/', async ctx => {
  let { id } = ctx.query;
  console.log(ctx.query);

  ctx.body = 'bbb';
});

server.use(router.routes());
