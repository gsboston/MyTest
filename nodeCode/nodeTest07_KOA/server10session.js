const Koa = require('koa');
const Router = require('koa-router');
const session = require('koa-session');

let server = new Koa();
server.listen(8080);

// session强制签名
server.keys = [
  'asdfasdfasdfasdfasdf',
  'hghjfgjghjkyggfytyurt',
  'hjghjkfguig8ygyi8t78i8',
];

// 参数需要服务端实例 server，主要是为了拿到key
server.use(session({
  maxAge: 20 * 60 * 1000,   //有效期
  renew: true           //自动续期 
}, server));

server.use(async ctx => {
  // koa中session直接存在ctx上
  if (!ctx.session['view']) {
    ctx.session['view'] = 0;
  }

  ctx.session['view']++;

  ctx.body = `欢迎你第${ctx.session.view}次来访`;
});

// koa 不带session
// cnpm i koa-session -D