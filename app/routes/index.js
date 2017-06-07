// @flow
const compose = require('koa-compose');

const auth = require('./auth');
const uploaders = require('./uploaders');
const uploads = require('./uploads');
const web = require('./web');

exports.router = compose([
  auth.router,
  uploaders.router,
  uploads.router,
  web.router,
]);
