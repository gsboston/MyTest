const path=require('path');

module.exports={
  mode: 'development',
  entry: './src/js/1.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.min.js'
  },
  module: {
    rules: [
      {test: /\.css$/, use: ['style-loader', 'css-loader', 'postcss-loader']},
      {test: /\.(jpg|png|gif)$/i, use: {
        loader: 'file-loader',
        options: {
          outputPath: 'images/'
        }
      }}
    ]
  }
};
