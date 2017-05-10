// @flow
const compose = require('koa-compose');

const uploads = require('./uploads');
const web = require('./web');

exports.router = compose([
  uploads.router,
  web.router,
]);
