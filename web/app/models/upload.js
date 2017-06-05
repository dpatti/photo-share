// @flow
import type {UploadType} from './upload-type';

export class Upload {
  id: number;
  filename: string;
  type: UploadType;
  uploader: string;
  fileUrl: string;
  previewUrl: ?string;
  galleryUrl: ?string;
}
