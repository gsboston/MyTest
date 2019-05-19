const Koa = require('koa');
const Router = require('koa-router');

let server = new Koa();
server.listen(8080);

server.context.a = 12;

//
let router = new Router();


router.get('/login', async ctx => {


  if (ctx.query.user && ctx.query.pass) {
    // ctx.throw(400,'user and pwd is required');

    // 推荐这种写法
    // 如果条件不成立直接throw
    ctx.assert(ctx.query.user, 400, 'username is required');
    ctx.assert(ctx.query.pass, 400, 'password is required');

    ctx.body = '成功';
  }
});

server.use(router.routes());
