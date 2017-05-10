// @flow
declare module 'koa' {
  import type {Server, IncomingMessage, ServerResponse} from 'http';

  declare type Continuation = () => Promise<void>;
  declare type Middleware =
    (context: Context, next: Continuation) => Promise<void>|void;

  declare type Context = {
    req: IncomingMessage,
    res: ServerResponse,

    response: Response,
  };

  declare type Response = {
    body: JSON | ToJSON,
    set(name: string, value: string): void,
  };

  declare class Application extends events$EventEmitter {
    use(middleware: Middleware): void;
    listen: $PropertyType<Server, 'listen'>;
  }

  declare module.exports: Class<Application>;
}
