const Router=require('koa-router');
const path=require('path');
const common=require('../../libs/common');

let router=new Router();

const fields=[
  {title: '标题', name: 'title', type: 'text'},
  {title: '图片', name: 'src', type: 'file'},
  {title: '链接', name: 'href', type: 'text'},
  {title: '序号', name: 'serial', type: 'number'},
];
const table='banner_table';
const page_type='banner';
const page_types={
  'banner': 'banner管理',
  'catalog': '类目管理',
  'article': '文章管理',
};

//通用
router.get('/', async ctx=>{
  const {HTTP_ROOT}=ctx.config;

  let datas=await ctx.db.query(`SELECT * FROM ${table}`);

  await ctx.render('admin/table', {
    HTTP_ROOT,
    page_type,
    page_types,
    datas,
    fields
  })
});

router.post('/', async ctx=>{
  let {HTTP_ROOT}=ctx.config;
  let {title, src, href, serial}=ctx.request.fields;
  src=path.basename(src[0].path);

  await ctx.db.query(`INSERT INTO ${table} (title, src, href, serial) VALUES(?,?,?,?)`, [
    title, src, href, serial
  ]);

  ctx.redirect(`${HTTP_ROOT}/admin/${page_type}`);
});



router.get('/delete/:id/', async ctx=>{
  let {id}=ctx.params;
  let {UPLOAD_DIR, HTTP_ROOT}=ctx.config;

  let data=await ctx.db.query(`SELECT * FROM ${table} WHERE ID=?`, [id]);
  ctx.assert(data.length, 400, 'no data');

  let row=data[0];

  await common.unlink(path.resolve(UPLOAD_DIR, row.src));
  await ctx.db.query(`DELETE FROM ${table} WHERE ID=?`, [id]);

  ctx.redirect(`${HTTP_ROOT}/admin/banner`);
});

/*router.get('/modify/:id/', async ctx=>{
  let {id}=ctx.params;
  const {HTTP_ROOT}=ctx.config;

  console.log(id);

  let data=await ctx.db.query('SELECT * FROM banner_table WHERE ID=?', [id]);
  ctx.assert(data.length, 400, 'no data');

  let row=data[0];

  await ctx.render('admin/table', {
    HTTP_ROOT,
    type: 'modify',
    old_data: row,
    fields,
    action: `${HTTP_ROOT}/banner/modify/${id}`
  });
});*/
router.get('/get/:id', async ctx=>{
  let {id}=ctx.params;

  let rows=await ctx.db.query(`SELECT * FROM ${table} WHERE ID=?`, [id]);

  if(rows.length==0){
    ctx.body={err: 1, msg: 'no this data'};
  }else{
    ctx.body={err: 0, msg: 'success', data: rows[0]};
  }
});

router.post('/modify/:id/', async ctx=>{
  const post=ctx.request.fields;
  let {id}=ctx.params;
  let {UPLOAD_DIR, HTTP_ROOT}=ctx.config;

  //获取原来的
  let rows=await ctx.db.query(`SELECT * FROM ${table} WHERE ID=?`, [id]);
  ctx.assert(rows.length, 400, 'no this data');

  const old_src=rows[0].src;

  //
  let keys=['title', 'href', 'serial'];
  let vals=[];

  keys.forEach(key=>{
    vals.push(post[key]);
  });

  //单独处理文件
  let src_changed=false;
  if(post.src && post.src.length && post.src[0].size){
    src_changed=true;
  }

  if(src_changed){
    keys.push('src');
    vals.push(path.basename(post.src[0].path));
  }

  //
  await ctx.db.query(`UPDATE ${table} SET ${
    keys.map(key=>(`${key}=?`)).join(',')
  } WHERE ID=?`, [...vals, id]);

  if(src_changed){
    await common.unlink(path.resolve(UPLOAD_DIR, old_src));
  }

  ctx.redirect(`${HTTP_ROOT}/admin/${page_type}`);
});

module.exports=router.routes();
