// @flow
import type {Context, Continuation} from 'koa';

const Promise = require('bluebird');
const compose = require('koa-compose');
const staticHandler = require('koa-static');

// const koaWebpack = require('koa-webpack');

const webpack = require('web/node_modules/webpack');
const webpackMiddleware = require('web/node_modules/webpack-dev-middleware');
const webpackConfig = require('web/webpack.config.js');

const compiler = webpack(webpackConfig);

const webpackMiddlewareConfig = {
  publicPath: '/',
  noInfo: false,
  lazy: true,
  stats: {colors: true},
};

const webpackHandler = webpackMiddleware(
  compiler,
  webpackMiddlewareConfig
);

// const routeWebpack = koaWebpack({
//   compiler: compiler,
//   dev: webpackMiddlewareConfig,
// });

const routeWebpack = async (context: Context, next: Continuation) => {
  await new Promise((resolve, _reject) => {
    webpackHandler(context.req, {
      end: (content) => {
        context.response.body = content;
        resolve();
      },
      setHeader: (name, value) => {
        context.response.set(name, value);
      }
    }, () => {
      resolve(next());
    });
  });
};

exports.router = compose([
  routeWebpack,
  staticHandler('web/public/'),
]);
