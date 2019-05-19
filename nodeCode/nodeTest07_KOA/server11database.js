const Koa = require('koa');
const Router = require('koa-router');

let server = new Koa();
server.listen(8080);

server.context.db = require('./libs/database');

// 在所有路由之前进行错误处理，相当于在整个服务级别
server.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    ctx.body = '错了';
  }
});

let router = new Router();

// 在路由中处理错误
// 如当前router是处理管理员相关操作，就可以在这校验是否有权限
router.all('*', async ctx => {
  // if(ctx.session['admin_id'])

  try {
    await next();
  } catch (e) {
    ctx.body = '错了-router';
  }
});

router.get('/a', async ctx => {
  // let data = await ctx.db.query('SELECT * FROM item_table');
  ctx.body = div.title;
});

server.use(router.routes());

// cnpm i mysql co-mysql -D