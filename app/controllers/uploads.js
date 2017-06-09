// @flow
import type {Context} from 'koa';

const compose = require('koa-compose');
const {UniqueConstraintError} = require('sequelize');

const {Upload} = require('app/models');

const {StoredFile, put} = require('app/services/storage');
const catching = require('app/util/catching');
const respond = require('app/util/respond');
const withFiles = require('app/util/with-files');

exports.index = async (context: Context) => {
  const from = context.request.query.from || 0;
  const by = context.request.query.by;

  const uploads = await Upload.findAll({
    where: Upload.whereUploader(by),
    order: [['createdAt', 'DESC']],
    limit: 20,
    offset: from,
  });

  respond(context, uploads);
};

exports.create = compose([
  catching(UniqueConstraintError, async (context: Context) => {
    context.throw(409, 'That image was already uploaded');
  }),
  withFiles(async (context, {files, fields}) => {
    if (!files.uploadFile) {
      return context.throw(422, "File 'uploadFile' missing");
    }

    if (!fields.uploader) {
      return context.throw(422, "Field 'uploader' missing");
    }

    const file = await StoredFile.fromLocal(files.uploadFile);
    const type = Upload.inferType(file.mimeType());

    if (type == null) {
      return context.throw(422, 'File type not supported');
    }

    const upload = Upload.build({
      filename: file.filename,
      type,
      uploader: fields.uploader,
      fileUrl: file.remoteUrl().href,
    });

    const existing = await Upload.findOne({
      where: {fileUrl: upload.fileUrl}
    });

    if (existing) {
      return respond(context, existing);
    }

    // No hooks because of https://github.com/sequelize/sequelize/issues/7769
    const err = await upload.validate({hooks: false});
    if (err) {
      return context.throw(422, err.message);
    }
    await put(file);
    await upload.save();

    respond(context, upload);
  })
]);
