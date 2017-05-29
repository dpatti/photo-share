// @flow
import type {Context} from 'koa';

const {Upload} = require('app/models');

const {StoredFile, put} = require('app/services/storage');
const respond = require('app/util/respond');
const withFiles = require('app/util/with-files');

exports.index = async (context: Context) => {
  const from = context.request.query.from || 0;
  const uploads = await Upload.findAll({
    order: [['createdAt', 'DESC']],
    limit: 20,
    offset: from,
  });

  respond(context, uploads);
};

exports.create =
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
      return context.throw(422, "File type not supported");
    }

    const upload = Upload.build({
      filename: file.filename,
      type: type,
      uploader: fields.uploader,
      fileUrl: file.remoteUrl().href,
    });

    const err = await upload.validate();
    if (err) {
      return context.throw(422, err.message);
    }
    await put(file);
    await upload.save();

    respond(context, upload);
  });
