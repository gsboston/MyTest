const url = require('url');
const querystring = require('querystring');

let str = 'http://www.123.com/index.html?a=1&b=2';
url.parse(str);//返回一个包含请求url相关信息的对象。
let { pathname, query } = url.parse(str, true);//true 指处理参数


//querystring
querystring.parse('a=12&b=9'); // {a:12,b:9}
querystring.stringify({ a: 12, b: 9 }); // 'a=12&b=9'