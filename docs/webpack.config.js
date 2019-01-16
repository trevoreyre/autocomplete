const path = require('path')

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
      use: {
        loader: 'babel-loader'
      }
    }, {
      test: /\.css$/,
      use: [
        { loader: 'style-loader' },
        { loader: 'css-loader' }
      ]
    }]
  },
  devServer: {
    contentBase: __dirname,
    port: 3000,
    host: '0.0.0.0'
  }
}
