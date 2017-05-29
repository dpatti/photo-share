// @flow
/* eslint-disable no-console */

const database = require('app/services/database');
// TODO: we are using this to load the model definitions, but can we be sure
// they are all required by the index file?
require('app/models');

database.sync({
  // TODO: sequelize 4
  // alter: true,
  logging: console.log,
}).
  then(_ => console.log('Sync successful')).
  catch(err => console.error('Sync error:', err.message)).
  then(_ => process.exit());
