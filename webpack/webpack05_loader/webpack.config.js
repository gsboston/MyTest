const path = require('path');

module.exports = {
	mode: 'development',
	entry: {
		main: './src/index.js'
	},
	module: {
		rules: [{
			test: /\.(jpg|png|gif)$/,
			use: {
				loader: 'file-loader',
				options: {
					// placeholder-占位符,不指定则打包后的图片是随机生成的名字
					name: '[name]_[hash].[ext]',
					outputPath: 'images/'
				}
			}

		}, 
		//{
			// test: /\.(jpg|png|gif)$/,
			// use: {
			// 	// url-loader 会将图片打包成base64放到bundle.js中，小的图片适用
			// 	loader: 'url-loader',
			// 	options: {
			// 		name: '[name]_[hash].[ext]',
			// 		outputPath: 'images/',
			// 		limit: 2048 //图片大小小于2048字节，使用base64方式打包，否则会打包成图片文件
			// 	}
			// }
		//},
		{
			test: /\.(eot|ttf|svg)$/,
			use: {
				loader: 'file-loader'
			}
		}, {
			test: /\.(css|scss)$/,
			// css-loader 负责分析css文件的关系，然后合并
			// style-loader 得到css-loader分析出得结果后，将css挂载到html header style中
			// loader执行顺序是倒序，先执行的在后面
			use: [
				'style-loader',
				{   // 当一个scss文件中通过import了另一个scss文件，那么在打包这个scss文件的时候就会直接走到css-loader
					// 所以要在css-loader的options中加入importLoaders，表示走css-loader之前还要走另外两个loader
					loader: 'css-loader',
					options: {
						importLoaders: 2,
						modules: true // 默认false，引入的css属于全局的样式，开启true后，css变为模块化，引入css时可以通过style.xxx
					}
				},
				'sass-loader',
				'postcss-loader'
			]
		}]
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	}
}

// webpack不能识别非js文件
// loader帮助webpack打包不能识别的文件，在module中定义loader
// 安装file-loader
// npm install file-loader -D

// sass需要安装 sass-loader node-sass

// postcss-loader 可以自动添加css3前缀 新建postcss.config.js配置文件
// 安装插件cnpm i autoprefixer -D 