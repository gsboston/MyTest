const koa = require('koa');
const Router = require('koa-router');

// 比express多一步new
let server = new koa();
server.listen(8080);

// express自带路由，koa中不带路由，独立出去作为一个新的模块，也是同团队写的
// cnpm i koa-router -D
// 1.创建一个路由
let router = new Router();
// 2.添加路由
// express中有req,res，但是在koa中只有一个ctx 上下文对象
// koa中使用async
router.get('/a', async (ctx, next) => {
    // ctx.req ctx.res
    ctx.body = "aaa";
    ctx.body += "bbb";
})

// 3.到这router和服务器是没有关联的。
// use 添加中间件，原来的use在koa中是all
// server.use(router.routes());

// koa独立路由的好处就是嵌套路由，庞大的应用拆分


router.use('/user', require('./routers/user'));

//加载路由中间件
server.use(router.routes());
