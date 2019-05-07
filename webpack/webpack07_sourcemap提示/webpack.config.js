const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
	mode: 'development',
	// development devtool: 'cheap-module-eval-source-map',
	// production devtool: 'cheap-module-source-map',
	// devtool: 'none',// 当关闭sourcemap时，js报错只会提示在打包后的js文件中。
	// devtool: 'source-map', // dist目录下会生成一个map.js文件，里面时映射关系
	// devtool: 'inline-source-map', // 不会生成map文件，而是变成一个base64字符串放到index.js底部
	// 不加cheap的情况映射关系复杂，报错具体到行-字符。耗费性能。加上cheap同时不去映射第三方代码，只负责业务代码
	// 加module，解决加入cheap后，不管第三方模块的代码问题。
	// eval，不会生成map文件，也不会有base64编码的字符串，而是改变代码执行方式(node)，跟一个sourceURL指向index.js,性能最好，
	// 开发环境最佳实践
	devtool: 'cheap-module-eval-source-map',
	// 生产环境最佳实践
	// devtool: 'cheap-module-source-map',
	entry: {
		main: './src/index.js'
	},
	module: {
		rules: [{
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
		}]
	},
	plugins: [new HtmlWebpackPlugin({
		template: 'src/index.html'
	}), new CleanWebpackPlugin(['dist'])],
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist')
	}
}


// sourceMap 是一个映射关系，他知道dist目录下main.js文件出错位置，对应的是src下的index.js文件的位置。
// sourceMap 原理