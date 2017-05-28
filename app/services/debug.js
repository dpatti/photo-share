// @flow
const logger = require('./logger');

declare function trace<T>(value: T): T;
global.trace = (value) => {
  logger.debug(value);
  return value;
};
