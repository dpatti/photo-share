// @flow
const {nodeEnv, optional, required, variable, fromEnv} = require('app/util/config');
const {resolve} = require('path');
const dotenv = require('dotenv');

dotenv.load({
  path: resolve(
    __dirname, '..', '..',
    'config', `${nodeEnv(process.env)}.env`
  ),
});

module.exports = fromEnv({
  auth: {
    secret: required(variable('AUTH_SECRET')),
    password: required(variable('AUTH_PASSWORD')),
  },
  database: {
    uri: required(variable('DATABASE_URI')),
  },
  server: {
    port: optional(variable('SERVER_PORT'), 3000),
  },
  storage: {
    bucket: required(variable('STORAGE_BUCKET')),
    namespace: optional(variable('STORAGE_NAMESPACE'), ''),
    key: required(variable('STORAGE_KEY')),
    secret: required(variable('STORAGE_SECRET')),
  },
}, process.env);
