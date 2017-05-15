// @flow
const compose = require('koa-compose');

const auth = require('./auth');
const uploads = require('./uploads');
const web = require('./web');

exports.router = compose([
  auth.router,
  uploads.router,
  web.router,
]);
