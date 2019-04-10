const Koa = require('koa');
const ejs = require('koa-ejs');
const path = require('path');
const Router = require('koa-router');

let server = new Koa();
server.listen(8080);

ejs(server, {
  root: path.resolve(__dirname, 'template'),
  layout: false,
  viewExt: 'ejs',
  cache: false,
  debug: false
});

let router = new Router();

router.get('/list/:id', async ctx => {
  let { id } = ctx.params;
  await ctx.render(id, {
    arr: [1, 2, 3, 4, 5]
  });
});

// 匹配根路由
router.get('', async ctx => {
  ctx.body = 'all';
});

// 匹配全部路由
router.get('*', async ctx => {
  ctx.body = 'other';
});

server.use(router.routes());
server.use(router.allowedMethods());
