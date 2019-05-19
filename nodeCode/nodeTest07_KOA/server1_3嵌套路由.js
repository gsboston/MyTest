const koa = require('koa');
const Router = require('koa-router');

let server = new koa();
server.listen(8080);

// 主路由
let router = new Router(); 

// 如果路由过于庞大会导致这里不好维护，一般都是将路由放到单独文件中
// 新建routers文件件，内部创建index admin visitor 文件

// 引用user 默认引用下面的index.js
router.use('/user', require('./routers/user'));

server.use(router.routes());