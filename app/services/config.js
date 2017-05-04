// @flow
const {optional, required, variable, fromEnv} = require('app/util/config');
require('dotenv').config();

module.exports = fromEnv({
  server: {
    port: optional(variable('SERVER_PORT'), 3000),
  },
  database: {
    uri: required(variable('DATABASE_URI')),
  },
}, process.env);
