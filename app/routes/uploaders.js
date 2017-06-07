// @flow
const uploaders = require('app/controllers/uploaders');
const route = require('app/util/route');
const withAuth = require('app/util/with-auth');

exports.router = route(router => {
  router.get('/uploaders', withAuth(uploaders.index));
});

