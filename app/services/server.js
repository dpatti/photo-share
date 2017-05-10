// @flow
const Koa = require('koa');
const {server: config} = require('./config');
const root = require('app/routes');
const logger = require('./logger');

const app = new Koa();
app.use(root.router);

exports.start = () => {
  app.listen(config.port, () => {
    logger.info(`Listening on ${config.port}`);
  });
};
