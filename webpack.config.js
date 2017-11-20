/**
 * Created by Mr.Carry on 2016/11/21.
 */


var path = require('path');
var fs = require("fs");
var webpack = require('webpack');

var rootPath = path.resolve(__dirname, './components/main/');


/**
 * 获取main页面配置
 * @returns {{}}
 */
var getMainPaths = function () {
  var rootPath = path.resolve(__dirname, './components/main/');
  var list = fs.readdirSync(rootPath);
  var keys = {};
  list.forEach((item)=> {
    keys[item.replace('.js', '')] = rootPath + '/' + item;
  });
  return keys;
};

module.exports = {
  entry: getMainPaths(),
  output: {
    path: path.resolve(__dirname, './www/static/build'),
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
        loader: 'file-loader',
        query: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  devtool: '#eval-source-map',
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true,//这里的soucemap 不能少，可以在线上生成soucemap文件，便于调试
      mangle: true
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    })
  ],
  externals: {
    'antd': true,
    'react': 'React',
    'react-dom': 'ReactDOM'
  }
};

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ])
}