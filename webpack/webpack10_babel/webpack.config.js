const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
	mode: 'development',
	devtool: 'cheap-module-eval-source-map',
	entry: {
		main: './src/index.js'
	},
	devServer: {
		contentBase: './dist',
		open: true,
		port: 8080,
		hot: true,
		hotOnly: true
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /node_modules/, // 排除node_modules中的代码
			// 添加babel-loader分析js语法，打通babel和webpack，但是还是需要借助其他babel模块才能将es6-》es5
			loader: 'babel-loader',
			options: {
				// 业务代码如此配置即可
				// presets:[["@babel/preset-env"],{
				// 	targets:{
				// 		chrome: ">67"
				// 	},
				// 	// 当使用polyfill的时候，并不是将所有特性都加入，而是根据业务代码决定加什么
				// 	useBuiltIns: 'usage'
				// }]
				// 库代码使用此配置，解决polyfill的问题
				"plugins": [["@babel/plugin-transform-runtime"], {
					"corejs": 2, // cnpm i @babel/runtime-corejs2 -D
					"helpers": true,
					"regenerator": true,
					"useESModules": false
				}]
			}
		}, {
			test: /\.(jpg|png|gif)$/,
			use: {
				loader: 'url-loader',
				options: {
					name: '[name]_[hash].[ext]',
					outputPath: 'images/',
					limit: 10240
				}
			}
		}, {
			test: /\.(eot|ttf|svg)$/,
			use: {
				loader: 'file-loader'
			}
		}, {
			test: /\.scss$/,
			use: [
				'style-loader',
				{
					loader: 'css-loader',
					options: {
						importLoaders: 2
					}
				},
				'sass-loader',
				'postcss-loader'
			]
		}, {
			test: /\.css$/,
			use: [
				'style-loader',
				'css-loader',
				'postcss-loader'
			]
		}]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'src/index.html'
		}),
		new CleanWebpackPlugin(['dist']),
		new webpack.HotModuleReplacementPlugin()
	],
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist')
	}
}

// 安装 npm i babel-loader @babel/core
// babel-loader是帮助webpack打包的工具
// babel/core是babel的核心库，可以让babel识别js中语法，将js代码转换为AST抽象语法树。

// 添加babel-loader分析js语法，打通babel和webpack，但是还是需要借助其他babel模块才能将es6-》es5
// 安装 npm i @babel/preset-env -D
// 但这只会将一些es6的语法转换成es5，但是一些方法在低版本的浏览器中依然不支持。还需要借助polyfill

// cnpm i @babel/polyfill -D
// 在业务代码最顶部import "@babel/polyfill";
// 但是会导致打包后的js文件变得特大，配置useBuiltIns: 'usage'。只配置需要的特性
// polyfill在注入方法的时候通过全局变量会污染全局环境，不适用于打包组件。
// 解决办法
// cnpm i @babel/plugin-transform-runtime -D
// cnpm i @babel/runtime -D
// 在babel options中添加plugins配置

// options内的配置可以单独放到.babelrc文件即可