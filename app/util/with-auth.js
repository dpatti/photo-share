// @flow
import type {Context, Continuation, Middleware} from 'koa';

const {verify} = require('app/services/auth');

module.exports = (handler: Middleware): Middleware =>
  async (context: Context, next: Continuation) => {
    const auth = context.request.headers.authorization;

    if (auth) {
      const [_, token] = auth.split(' ');

      if (verify(token)) {
        await handler(context, next);
        return;
      }
    }

    context.throw(403);
  };
