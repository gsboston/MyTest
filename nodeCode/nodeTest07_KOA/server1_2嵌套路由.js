const koa = require('koa');
const Router = require('koa-router');

let server = new koa();
server.listen(8080);

// 主路由
let router = new Router(); 

// 二级路由
let userRouter = new Router();
    let visitor = new Router();
    visitor.get('/home', async ctx => {
        ctx.body = '游客home';
    })

    let admin = new Router();
    admin.get('/home', async ctx => {
        ctx.body = '管理员home';
    })

    userRouter.use(visitor.routes());
    userRouter.use(admin.routes());

// 二级路由
let newsRouter = new Router();
// ……

router.use('/user', userRouter.routes());
router.use('/news',newsRouter.routes());

server.use(router.routes());