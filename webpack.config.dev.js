var path = require('path');
var pkg = require('./package.json');

module.exports = {
  entry: {
    'index': './src/index.js',
    'watch': './src/watch/SimWatch.js'
  },
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'build'),
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
            test: /\.js$/,
            exclude: /(node_modules)|dist/,
            use: {
                loader: "babel-loader?cacheDirectory=true"
            }
        },
        {
            test: /\.css$/,
            use: ["style-loader" , "css-loader"]
        },
        {
            test: /\.less$/,
            use: [
                 "style-loader" ,
                {
                    loader: "css-loader"
                },
                {
                    loader: "less-loader"
                }
            ]
        },
        {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: "url-loader"
        },
        {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: "url-loader"
        }
    ]
  },
  stats: "minimal",
  mode: 'development',
  plugins: [],
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: "vendor"
    }
  },
  devServer: {
    compress: true,
    open: true,
    openPage: "demo/index.html?caseId=1072",
    publicPath: '/demo/',
    port: 3434,
    host: '0.0.0.0',
    watchOptions: {
      poll: 1000,
      ignored: /node_modules|gulpfile/,//不监测
    },
    proxy: {
      '/api': {
        target: "http://11.162.132.30",
        // target:"http://30.117.27.247:7001",
        changeOrigin: true
      },
    }
  }
};
