// @flow
const {createHash, timingSafeEqual} = require('crypto');
const jwt = require('jsonwebtoken');
const {auth: config} = require('./config');
const customError = require('app/util/custom-error');

const hash = (password: string): Buffer =>
  createHash('sha256').update(password).digest();

const test = (password: string): boolean =>
  timingSafeEqual(hash(config.password), hash(password));

const sign = (payload: JSONValue): string =>
  jwt.sign(payload, config.secret, {algorithm: 'HS256'});

const InvalidPassword = exports.InvalidPassword = customError('InvalidPassword');

const verify = (token: string): JSONValue =>
  jwt.verify(token, config.secret, {algorithms: ['HS256']});

exports.authenticate = (password: string) => {
  if (test(password)) {
    return sign({auth: true});
  } else {
    throw new InvalidPassword('Invalid password');
  }
};

exports.verify = (token: string) => verify(token);
