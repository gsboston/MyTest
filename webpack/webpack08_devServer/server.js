const express = require('express');
const webpack = require('webpack');
// webpack 中间件
const webpackDevMiddleware = require('webpack-dev-middleware');
// 通过webpack和配置生成一个webpack编译器
const config = require('./webpack.config.js');
// 安装express webpack-dev-middleware

const complier = webpack(config);

const app = express();

app.use(webpackDevMiddleware(complier, {
	// publicPath: config.output.publicPath
}));

app.listen(3000, () => {
	console.log('server is running');
});

// 这种方式叫在node中使用webpack
// 另一种就是在命令行中使用webpack