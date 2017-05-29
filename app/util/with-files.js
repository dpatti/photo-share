// @flow
import type {Context, Continuation, Middleware} from 'koa';

const {ReadStream} = require('fs');
const {keyBy} = require('lodash');
const busboy = require('async-busboy');
const {unlink} = require('app/util/fs');

class BusboyFile extends ReadStream {
  // TODO: flow's ReadStream doesn't define path, which is documented API
  path: string;
  fieldname: string;
  filename: string;
  encoding: string;
  mimeType: string;
}
type Handler =
  (Context, {files: Keyed<BusboyFile>, fields: Keyed<string>}, Continuation) => Promise<void>;

module.exports = (handler: Handler): Middleware =>
  async (context: Context, next: Continuation) => {
    const {files, fields} = await busboy(context.req);
    const indexedFiles = keyBy(files, 'fieldname');

    await handler(context, {files: indexedFiles, fields}, next);
    await Promise.all(files.map(file => unlink(file.path)));
  };
