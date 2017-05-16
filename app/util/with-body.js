// @flow
import type {Context, Continuation, Middleware} from 'koa';

const bodyParser = require('koa-bodyparser')();

type Handler<T> = (Context, T, Continuation) => Promise<void>;
// I would expect this to work, since intersections on objects recurse to their
// shared properties. It doesn't work, nor does a simple example.
// type ExtendedContext = Context & {request: {body: JSONValue}};

module.exports = <T>(refine: (JSONValue => boolean), handler: Handler<T>): Middleware =>
  async (context: Context, next: Continuation) => {
    await bodyParser(context, () => {
      // TODO: See note above ExtendedContext.
      // eslint-disable-next-line flowtype/no-weak-types
      const body: JSONValue = (context: any).request.body;
      if (refine(body)) {
        // TODO: I'm trying to use the refinement of a map object to produce an
        // object type such that the refinement and accompanying handler
        // signature must agree. It doesn't seem to work, however. Refining a
        // map doesn't change how an object type appears.
        // eslint-disable-next-line flowtype/no-weak-types
        return handler(context, (body: any), next);
      } else {
        return context.throw(422);
      }
    });
  };
