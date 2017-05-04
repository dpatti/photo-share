declare module 'koa' {
  declare type Context = {
    response: Response,
  };

  declare type Response = {
    body: JSON | ToJSON,
  };

  declare module.exports: any;
}
