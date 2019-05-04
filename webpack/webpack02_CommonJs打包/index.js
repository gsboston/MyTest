// ES Moudule 模块引入方式
// CommonJS 模块引入规范
// CMD
// ADM

// webpack 模块打包工具
// 最早只是js 模块打包工具 -> 现在已经可以打包css，png jpg等

// import Header from './header.js';
// import Sidebar from './sidebar.js';
// import Content from './content.js';

var Header = require('./header.js');
var Sidebar = require('./sidebar.js');
var Content = require('./content.js');

new Header();
new Sidebar();
new Content();