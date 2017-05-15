// @flow
import type {Context} from 'koa';

const compose = require('koa-compose');
const catching = require('app/util/catching');
const withBody = require('app/util/with-body');
const respond = require('app/util/respond');
const {InvalidPassword, authenticate} = require('app/services/auth');

const toBody = (json: JSON): boolean =>
  json != null
    && typeof json === 'object'
    && !Array.isArray(json)
    && typeof json.password === 'string';

exports.create = compose([
  catching(InvalidPassword, async (context: Context) => {
    context.throw(401, 'Invalid password');
  }),
  withBody(toBody, async (context: Context, body: {password: string}) => {
    const token = authenticate(body.password);
    respond(context, {token});
  }),
]);
