const mysql=require('mysql');
const co=require('co-mysql');

let conn=mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: '20181101'
});
let db=co(conn);

module.exports=db;
