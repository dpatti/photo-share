// @flow
import type {Context} from 'koa';

const {first} = require('lodash');
const {Upload} = require('app/models');
const respond = require('app/util/respond');

exports.index = async (context: Context) => {
  const uploads = await Upload.findAll();

  respond(context, uploads);
};

exports.show = async (context: Context, id: string) => {
  const upload = first(await Upload.findById(Number(id)));

  respond(context, upload);
};

exports.create = async (context: Context) => {
  respond(context, {});
};
