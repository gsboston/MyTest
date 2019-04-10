const koa = require('koa');
const Router = require('koa-router');
const static = require('koa-static');
const body = require('koa-better-body');

let server = new koa();
// 可以在context上挂载一些变量
server.context.a = 12;

let listRouter = new Router();
listRouter.get('/', async ctx => {
    ctx.body = 'home-list';
});
// encode方式传参
listRouter.get('/:id', async ctx => {
    ctx.body = `home-list,id=${ctx.params.id}`;
});
let userRouter = new Router();
userRouter.get('/', async ctx => {
    ctx.body = 'home-user';
});
// query方式传参
userRouter.get('/detail', async ctx => {
    // ctx.assert(ctx.query.id, 400, 'id is required');
    ctx.body = ctx.query;
});

let homeRouter = new Router();
homeRouter.get('/', async ctx => {
    ctx.body = 'home';
});
homeRouter.use('/list', listRouter.routes()).use('/user', userRouter.routes());

let router = new Router();
router.use('/home', homeRouter.routes());

// 设置资源过期时长
router.all(/(\.jpg|\.png|\.gif)$/i, static('./static', {
    maxage: 1 * 1 * 1000
}));
router.all('', static('./static', {
    maxage: 30 * 86400 * 1000
}));

//加载路由中间件
server.use(router.routes());
//当请求数据的方法与设置的方法不一致，会报错。比如默认get请求获取，用post发请求会报错
server.use(router.allowedMethods());

// server.use(static('./static', {
//     maxage: 86400 * 1000,
//     index: '1.html'
// }));

server.listen(8080);
