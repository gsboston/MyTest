const pug=require('pug');

pug.renderFile('./template/1.pug', {
  pretty: true,
  title: 'aaaaa',
  users: [
    {name: 'blue', password: '123456'},
    {name: '张三', password: '654321'},
    {name: '李四', password: '555555'},
  ]
}, (err, data)=>{
  if(err){
    console.log('渲染失败');
  }else{
    console.log(data);
  }
});
