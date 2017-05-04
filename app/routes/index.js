// @flow
const compose = require('koa-compose');
const uploads = require('./uploads');

exports.router = compose([
  uploads.router,
]);
