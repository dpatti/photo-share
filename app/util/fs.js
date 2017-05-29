// @flow

const Promise = require('bluebird');
const fs = require('fs');

exports.unlink = Promise.promisify(fs.unlink);
