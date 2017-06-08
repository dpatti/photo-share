// @flow
import {assign, includes} from 'lodash';
import {lookup} from 'mime-types';

import type {UploadType} from './upload-type';

// TODO: deduplicate from server mimeMap
const validMimes = [
  'image/gif',
  'image/jpeg',
  'image/png',

  'video/mp4',
  'video/mpeg',
  'video/ogg',
  'video/quicktime',
  'video/webm',
];

export class Upload {
  id: number;
  filename: string;
  type: UploadType;
  uploader: string;
  fileUrl: string;
  previewUrl: ?string;
  galleryUrl: ?string;

  // TODO: This constructor will accept empty objects (any subset of Upload).
  // Also it would gladly override instance methods if you gave it any.
  constructor(object: $Shape<Upload>) {
    assign(this, object);
  }

  static isValidExtension(filename: string): boolean {
    return includes(validMimes, lookup(filename));
  }
}
