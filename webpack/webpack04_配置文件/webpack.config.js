// webpack中可以解析node语法
const path = require('path');

module.exports = {
	mode: 'production', // 打包模式，默认，设置development js不会被压缩
	// entry: './src/index.js', // 入口文件,
	entry: {// 打包输出两个文件，对应的output中的filename也要修改，打包后的两个文件都会放到html中
		main: './src/index.js',
		sub: './src/index.js'
	},
	output: { // 输入配置
		publicPath:'http://cdn.com.cn',// 指定打包的文件前缀地址
		// filename: 'bundle.js', // 打包好文件,默认是main.js
		filename:'[name].js',
		path: path.resolve(__dirname, 'dist') // 打包好的文件夹，默认就是dist
	}
}

// npx webpack 直接运行即可，不需要再写具体文件
// webpack.config.js 是webpack默认的配置文件，当然也可以手动修改
// npx webpack --config webpackconfig2.js

// 可以通过修改package.json 简化打包命令
// "scripts": {
//     "bundle": "webpack"
//   },

// 在scripts中使用webpack会优先在项目node_modules中找webpack，不用在全局安装
// npm run bundle

// 安装webpack-cli 包的作用是可以在命令行中运行webpack命令（npx webpack等命令）