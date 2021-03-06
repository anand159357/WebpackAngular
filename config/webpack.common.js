var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('mini-css-extract-plugin');
var helpers = require('./helpers');
var path = require('path');
function root(__path) {
  return path.join(__dirname, __path);
}

module.exports = {
  entry: {
    'polyfills': './src/polyfills.ts',
    'vendor': './src/vendor.ts',
    'app': './src/main.ts'
  },

  resolve: {
    extensions: ['.ts', '.js']
  },

  module: {
    rules: [
      {
        // Mark files inside `@angular/core` as using SystemJS style dynamic imports.
        // Removing this will cause deprecation warnings to appear.
        test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
        parser: { system: true },
      },
      {
        test: /\.ts$/,
        loaders: [
          {
            loader: 'awesome-typescript-loader',
            options: { configFileName: helpers.root('src', 'tsconfig.json') }
          } , 'angular2-template-loader'
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file-loader?name=assets/[name].[hash].[ext]'
      },
      // {
      //   test: /\.css$/,
      //   exclude: helpers.root('src', 'app'),
      //   loader: ExtractTextPlugin.loader
      // },
      {
        test: /\.css$/,
        use: [
          { loader: 'to-string-loader' }, 
          { loader: 'css-loader' },
          { loader: 'sass-loader' },
          {
            loader: ExtractTextPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it uses publicPath in webpackOptions.output
              publicPath: (resourcePath, context) => {
                // publicPath is the relative path of the resource to the context
                // e.g. for ./css/admin/main.css the publicPath will be ../../
                // while for ./css/main.css the publicPath will be ../
                return path.relative(path.dirname(resourcePath), context) + '/';
              }
            },
          },
          'css-loader',
        ],
      }
    ]
  },

  plugins: [
    // Workaround for angular/angular#11580
   
      new webpack.LoaderOptionsPlugin({
      options:{
        optimization: {
          splitChunks:{
              cacheGroups:{
                venders:{
                  priority: -10,
                  test: /[\\/]node_modules[\\/]/
                }
              },
              chuncks: 'async',
              minChunks: 1,
              minSize: 30000,
              name: true
          }
        }
      }
    }),

    // new webpack.optimize.CommonsChunkPlugin({
    //   name: ['app', 'vendor', 'polyfills']
    // }),

    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new webpack.ContextReplacementPlugin(/\@angular(\\|\/)core(\\|\/)fesm5/, path.join(__dirname, './src')),
    new ExtractTextPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    })
  ]
};