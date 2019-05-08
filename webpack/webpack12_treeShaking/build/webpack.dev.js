const webpack = require('webpack');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

const devConfig = {
	mode: 'development',
	devtool: 'cheap-module-eval-source-map',
	devServer: {
		contentBase: './dist',
		open: true,
		port: 8080,
		hot: true
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin()
	],
	optimization: {
		// 使用treeshaking 需要加入下配置，开发环境
		// package.json 中加入 "sideEffects": false,
		// 但是对于@babel/polly-fill这样的问题不需要treeshaking处理
		// "sideEffects":["@babel/polly-fill"]
		// 如css文件一般也需要排除 ["*.css"]
		usedExports: true
	}
}

module.exports = merge(commonConfig, devConfig);

// tree shaking的作用就是
// 当引入一个模块的时候，不引入全部代码，而是引入需要的代码。
// 只支持es module，import
// 如果在production模式下，不需要另外配置webpack.config
// 只需要将devtool改成cheap-module-source-map
// 如果在development下需要将devtool改成cheap-module-eval-source-map
// 并且还要加上optimization usedExports:true
// 另外还在在package.json中加入"sideEffects":false
// 但是如果某些文件不需要处理则加入数组中，如css文件，@babel/polly-fill等