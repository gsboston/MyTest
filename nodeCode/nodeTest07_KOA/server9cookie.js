const Koa = require('koa');
const Router = require('koa-router');

let server = new Koa();
server.listen(8080);

// cookie签名，非必要
// 一般会在服务端存几千几万个，通过程序生成
server.keys = [
  'sdfasdfasdfsadfasddfsdaf',
  'gutryurtyhfddyt8uytug',
  'tyutryur687tyuyujghjkhj',
];
server.use(async ctx => {
  // ctx.cookies.set('user', 'blue', {signed: true,maxAge:14*86400*1000});

  // 使用签名方式设置后，可以通过非签名方式获取，但是不会校验有效性，可以在客户端修改
  console.log(ctx.cookies.get('user', { signed: true }));
});

// cookie在koa中是自带的