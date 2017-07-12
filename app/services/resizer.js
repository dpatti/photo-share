// @flow
import type {UploadType} from 'app/models/upload';
import type {ImageTransform} from 'app/util/magick-with';

const {flow} = require('lodash');
const {lookup} = require('mime-types');

const {Upload} = require('app/models');
const magickWith = require('app/util/magick-with');

const FORMAT = 'jpg';
exports.PREVIEW_MIME_TYPE = lookup(FORMAT);

export type ResizerTransform = ImageTransform;

const match = <T>(mimeType: string, handler: {[UploadType]: T}): T => {
  const type = Upload.inferType(mimeType);

  return handler[type];
};

exports.contain = (size: number): ResizerTransform =>
  image => image.resize(size, size);

exports.cover = (size: number): ResizerTransform =>
  image => image.
    resize(size, size, '^').
    gravity('Center').
    extent(size, size);

const generateImagePreview =
  (transform: ResizerTransform, source: stream$Readable): stream$Readable =>
    magickWith(source,
      flow(transform, image => image.autoOrient().setFormat(FORMAT))
    );

const generateVideoPreview =
  (_transform: ResizerTransform, _source: stream$Readable): stream$Readable => {
    throw Error('Video previews not implemented');
  };

exports.generate =
  (transform: ResizerTransform, source: stream$Readable, mimeType: string): stream$Readable =>
    match(mimeType, {
      image: generateImagePreview,
      video: generateVideoPreview,
    })(transform, source);
