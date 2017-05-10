// @flow
const logger = require('./logger');

process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled promise rejection: ${err.stack}`);
});
