// @flow
import type {UploadType} from 'app/models/upload';

const gm = require('gm');
const {lookup} = require('mime-types');

const {Upload} = require('app/models');

const FORMAT = 'jpg';
exports.PREVIEW_MIME_TYPE = lookup(FORMAT);

export type ResizerSpec = {
  type: 'contain' | 'cover',
  size: number,
};

const match = <T>(mimeType: string, handler: {[UploadType]: T}): T => {
  const type = Upload.inferType(mimeType);

  return handler[type];
};

const contain = (image: gm, size: number): gm =>
  image.resize(size, size);

const cover = (image: gm, size: number): gm =>
  image.
    resize(size, size, '^').
    gravity('Center').
    extent(size, size);

const generateImagePreview =
  ({type, size}: ResizerSpec, source: stream$Readable): stream$Readable =>
    ({contain, cover})[type](gm(source), size).
      setFormat(FORMAT).
      stream();

const generateVideoPreview =
  (_spec: ResizerSpec, _source: stream$Readable): stream$Readable => {
    throw Error('Video previews not implemented');
  };

exports.generate =
  (spec: ResizerSpec, source: stream$Readable, mimeType: string): stream$Readable =>
    match(mimeType, {
      image: generateImagePreview,
      video: generateVideoPreview,
    })(spec, source);
