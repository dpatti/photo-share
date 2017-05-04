// @flow
const Sequelize = require('sequelize');
const {database: config} = require('./config');

module.exports = new Sequelize(config.uri, {
  dialect: 'postgres',
});
