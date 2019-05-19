const Router=require('koa-router');

let router=new Router();

router.get('/a', async ctx=>{
  ctx.body='游客的a';
});

module.exports=router.routes();
