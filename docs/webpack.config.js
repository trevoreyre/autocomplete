const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  context: __dirname,
  entry: {
    app: './index.js'
  },
  output: {
    publicPath: 'build',
    filename: '[name].js',
    path: path.resolve(__dirname, 'build')
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }, {
      test: /\.vue$/,
      exclude: /node_modules/,
      loader: 'vue-loader'
    }, {
      test: /\.css$/,
      loaders: ['style-loader','css-loader']
    }]
  },
  plugins: [
    new VueLoaderPlugin()
  ],
  devServer: {
    contentBase: __dirname,
    port: 3000,
    host: '0.0.0.0'
  }
}
