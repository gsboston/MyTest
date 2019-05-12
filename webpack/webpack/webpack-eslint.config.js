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
      {
        test: /\.js$/i,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        options: {

        }
      }
    ]
  },
  devtool: 'source-map'
};
