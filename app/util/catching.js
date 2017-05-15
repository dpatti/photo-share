// @flow
import type {Context, Continuation, Middleware} from 'koa';

type Handler = (Context, Error) => Promise<void>;

module.exports = (errorClass: Class<Error>, handler: Handler): Middleware =>
  async (context: Context, next: Continuation) => {
    try {
      await next();
    } catch (err) {
      if (err instanceof errorClass) {
        return handler(context, err);
      } else {
        throw err;
      }
    }
  };
