// @flow
const uploads = require('app/controllers/uploads');
const route = require('app/util/route');
const withAuth = require('app/util/with-auth');

exports.router = route(router => {
  router.get('/uploads', withAuth(uploads.index));
  router.post('/uploads', withAuth(uploads.create));
});
