// @flow
const compose = require('koa-compose');
const staticHandler = require('koa-static');

const koaWebpack = require('koa-webpack');

const webpack = require('web/node_modules/webpack');
const webpackConfig = require('web/webpack.config.js');

const webpackHandler = koaWebpack({
  compiler: webpack(webpackConfig),
  dev: {
    publicPath: '/',
    noInfo: false,
    lazy: true,
    stats: {colors: true},
  },
});

exports.router = compose([
  webpackHandler,
  staticHandler('web/public/'),
]);
