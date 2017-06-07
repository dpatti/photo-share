// @flow
import type {Context} from 'koa';

const {Uploader} = require('app/models');
const respond = require('app/util/respond');

exports.index = async (context: Context) => {
  const uploaders = await Uploader.findAll();

  respond(context, uploaders);
};
