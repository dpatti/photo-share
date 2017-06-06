// @flow
import EventEmitter from 'events';
import {inRange} from 'lodash';

export class UploadProgress extends EventEmitter {
  filename: string;
  finished: Promise<void>;

  constructor(file: File, xhr: XMLHttpRequest) {
    super();

    xhr.upload.addEventListener('progress', (e: ProgressEvent) => {
      if (e.lengthComputable) {
        const percentage = Math.round(100 * e.loaded / e.total);
        this.emit('progress', percentage);
      }
    });

    this.filename = file.name;
    this.finished = new Promise((resolve, reject) => {
      xhr.addEventListener('error', (_e: ProgressEvent) => {
        reject(this.error('network failure'));
      });
      xhr.addEventListener('load', (_e: ProgressEvent) => {
        if (inRange(xhr.status, 200, 300)) {
          resolve();
        } else {
          reject(this.error(`${xhr.response} (${xhr.status})`));
        }
      });
    });
  }

  error(message: string): Error {
    return Error(`Error uploading '${this.filename}': ${message}`);
  }
}
