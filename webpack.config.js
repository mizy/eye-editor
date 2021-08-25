var path = require('path');
var pkg = require('./package.json');
var webpack = require('webpack')

module.exports = {
  entry: {
    'index': './src/index.js',
    'watch': './src/watch/SimWatch.js'
  },
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, process.env.BUILD_DEST || 'build'),
    filename: '[name].js'
  },
  resolve: {
    // extensions: ['.js']
    extensions: ['.js', '.jsx'],
    alias: {
      utils$: path.resolve(__dirname, './src/utils.js'),
      api$: path.resolve(__dirname, './src/api.js')
    }
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0', 'react']
        }
      }
    ]
  },
  mode: 'production',
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      },
    }
  }

};
