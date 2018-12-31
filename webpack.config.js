const HtmlPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
  mode: 'development',
  entry: {
    app: './src/index.js'
  },
  output: {
    publicPath: '/',
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
  plugins: [
    new HtmlPlugin({
      template: './src/index.html'
    })
  ]
}
