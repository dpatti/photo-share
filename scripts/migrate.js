// @flow
const Sequelize = require('sequelize');
const Umzug = require('umzug');

const database = require('app/services/database');
const logger = require('app/services/logger');

const umzug = new Umzug({
  storage: 'sequelize',
  storageOptions: {
    sequelize: database,
    modelName: 'Schema',
    tableName: 'schema',
    columnName: 'migration',
    columnType: new Sequelize.STRING(100)
  },
  logging: logger.info,
  migrations: {
    params: () => [database.getQueryInterface(), Sequelize],
    path: 'migrations',
    pattern: /^\d+[\w-]+\.js$/,
  }
});

umzug.up().
  then(_ => { logger.info('Migrations run successfuly'); }).
  catch(err => { logger.error(err.stack); }).
  then(_ => { process.exit(); });
