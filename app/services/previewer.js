// @flow
import type {UploadType} from 'app/models/upload';

const gm = require('gm');
const {lookup} = require('mime-types');

const {Upload} = require('app/models');

const FORMAT = 'jpg';
const SIZE = 500;
exports.PREVIEW_MIME_TYPE = lookup(FORMAT);

const match = <T>(mimeType: string, handler: {[UploadType]: T}): T => {
  const type = Upload.inferType(mimeType);

  return handler[type];
};

const generateImagePreview = (source: stream$Readable): stream$Readable =>
  gm(source).
    resize(SIZE, SIZE, '^').
    gravity('Center').
    extent(SIZE, SIZE).
    setFormat(FORMAT).
    stream();

const generateVideoPreview = (_source: stream$Readable): stream$Readable => {
  throw Error('Video previews not implemented');
};

exports.generate = (source: stream$Readable, mimeType: string): stream$Readable =>
  match(mimeType, {
    image: generateImagePreview,
    video: generateVideoPreview,
  })(source);
