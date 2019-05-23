const Koa = require('koa');
const Router = require('koa-router');
const body = require('koa-better-body');

let server = new Koa();
server.listen(8080);

let router = new Router();

// 指定上传路径
server.use(body({
  uploadDir: './static/upload'
}));

router.post('/upload', async ctx => {
  //文件和post数据，btbody将数据放到request
  console.log(ctx.request.fields);

  ctx.body = 'aaa';
});

server.use(router.routes());


// cnpm i koa-better-body -D
// 支持的格式非常多
// post.html