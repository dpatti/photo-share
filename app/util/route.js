// @flow
const Router = require('koa-router');
const compose = require('koa-compose');

module.exports = (setup: (Router) => void) => {
  const router = new Router();
  setup(router);

  return compose([
    router.routes(),
    router.allowedMethods(),
  ]);
};
