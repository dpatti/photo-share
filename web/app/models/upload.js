// @flow
import type {UploadType} from './upload-type';

export class Upload {
  id: number;
  name: string;
  type: UploadType;
  uploader: string;
  fileUrl: string;
  thumbnailUrl: string;
}
