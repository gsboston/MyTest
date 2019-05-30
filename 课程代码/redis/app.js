const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const body = require('koa-better-body');

const session = require('koa-generic-session');
const Redis = require('koa-redis');

const Store = new Redis().client;

app.keys = ['dsada', 'dasfasfasfa2e4q'];

app.use(session({
    store: new Redis()
}));

let router = new Router();

router.get('/fix', async (ctx) => {
    const st = await Store.hset('fix', 'name', Math.random())
})

app.use(body({
    uploadDir: './static/upload'
}));

app.use(router.routes());

app.listen(3000);
