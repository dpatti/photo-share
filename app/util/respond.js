// @flow
import type {Context} from 'koa';

module.exports = (context: Context, model: ToJSON) => {
  context.response.body = model;
};
