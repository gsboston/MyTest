const Router=require('koa-router');

let router=new Router();

router.get('', async ctx=>{
  let {HTTP_ROOT}=ctx.config;

  let banners=await ctx.db.query("SELECT * FROM banner_table ORDER BY serial ASC");
  let catalogs=await ctx.db.query("SELECT * FROM catalog_table");



  await ctx.render('www/index', {
    HTTP_ROOT,
    banners,
    catalogs
  });
});

router.get('list/:id/', async ctx=>{
  let {HTTP_ROOT}=ctx.config;

  await ctx.render('www/list', {
    HTTP_ROOT,
  });
});

module.exports=router.routes();
