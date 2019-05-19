const Koa = require('koa');
const Router = require('koa-router');

let server = new Koa();
server.listen(8080);

//
let router = new Router();

// ":" 冒号的作用就是指明这一级不是就叫id，而是这一级可变，用叫id的名字接收这个参数
router.get('/news/:id/', async (ctx, next) => {
  // 接收参数就用万能的ctx
  let { id } = ctx.params;

  ctx.body = 'bbb';

  // 调用下一级
  await next();
});

// 参数个数随意
router.get('/news/:id1/:id2/:id3/', async ctx => {

})

// 当有如下路由时，locahost:8080/news/1 会走到哪个路由呢
// 跟express相同，先见到谁走谁。当然也可以通过next走到第二个
router.get('/news/1/', async ctx => {
  let { id } = ctx.params;

  ctx.body += 'aaa';
});

server.use(router.routes());
