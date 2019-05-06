const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
	mode: 'development',
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
	plugins: [
		// 自动生成一个html文件
		new HtmlWebpackPlugin({
			template: 'src/index.html'
		}), 
		// 重新打包先删除dist目录
		new CleanWebpackPlugin(['dist'])
	],
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	}
}


// plugin 类似生命周期函数，在打包特定的时间点做一些事情，如html-webpack-plugin是在打包结束后。还有打包js时等。
// npm install --save-dev html-webpack-plugin
// HtmlWebpackPlugin插件会在打包结束后，自动生成一个html文件，并把打包生成的js自动引入到这个html中，html中没有标签
// 通过模版template，这样在生成html文件时会以配置的html文件为模版生成。

// CleanWebpackPlugin插件会在打包前将dist目录删除，非官方
// cnpm i clean-webpack-plugin -D
