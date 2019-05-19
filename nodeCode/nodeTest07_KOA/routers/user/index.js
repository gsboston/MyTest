const Router=require('koa-router');

let router=new Router();

router.get('/', async ctx=>{
  ctx.body='用户';
});
router.use('/visitor', require('./visitor'));
router.use('/admin', require('./admin'));

module.exports=router.routes();
