const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
	mode: 'development',
	devtool: 'cheap-module-eval-source-map',
	entry: {
		main: './src/index.js'
	},
	devServer: {
		contentBase: './dist',
		open: true,
		port: 8080
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
		// publicPath: '/',
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist')
	}
}

// 解决问题：每次修改需要手动打包

// 1.在package.json中添加 "watch": "webpack --watch",
// npm run watch 
// webpack会监听要打包的文件，如果文件变化就会重新打包

// 2.在webpack.config.js 中配置devServer
// 在package.json中添加  "start": "webpack-dev-server",
// npm i webpack-dev-server -D
// npm run start
// 会自动刷新浏览器，启动服务器

// 3.自己编写一个node服务，如server.js 
// package.json中配置"server": "node server.js"
// 相当于在node中使用webpack