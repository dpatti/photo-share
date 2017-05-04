// @flow
const uploads = require('app/controllers/uploads');
const route = require('app/util/route');

exports.router = route(router => {
  router.get('/uploads', uploads.index);
  router.get('/uploads/:id', uploads.show);
  router.post('/uploads', uploads.create);
});
