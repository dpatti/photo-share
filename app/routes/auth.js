// @flow
const auth = require('app/controllers/auth');
const route = require('app/util/route');

exports.router = route(router => {
  router.post('/auth', auth.create);
});
