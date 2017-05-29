// @flow
import React from 'react';
import {clamp, first, without} from 'lodash';

import {UploadProgress} from 'app/models/upload-progress';
import {UploadProgressComponent} from './upload-progress-component';

const UPLOAD_CONCURRENCY = 4;
const ERROR_LIMIT = 5;

export class UploaderComponent extends React.Component {
  props: {
    auth: string,
    onDoneUploading: () => void,
  };

  state: {
    uploader: string,
    active: Array<UploadProgress>,
    queue: Array<File>,
    errors: Array<Error>,
  };

  constructor() {
    super();
    this.state = {
      uploader: localStorage.getItem('uploader') || '',
      active: [],
      queue: [],
      errors: [],
    };
  }

  componentDidUpdate(_: any, prevState: $PropertyType<UploaderComponent, 'state'>) {
    if (this.state.active !== prevState.active || this.state.queue !== prevState.queue) {
      this.checkQueue();
    }
  }

  checkQueue() {
    this.setState(state => {
      if (state.errors.length > ERROR_LIMIT) {
        return;
      }

      if (state.queue.length === 0) {
        return;
      }

      if (state.active.length > UPLOAD_CONCURRENCY) {
        return;
      }

      const next = first(state.queue);
      const progress = this.startUpload(next);

      return {
        active: state.active.concat(progress),
        queue: without(state.queue, next),
      };
    });
  }

  addError(err: Error) {
    this.setState(state => ({
      errors: state.errors.concat(err)
    }));
  }

  createUpload(file: File): XMLHttpRequest {
    var data = new FormData();
    data.append('uploadFile', file);
    data.append('uploader', this.state.uploader);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/uploads', true);
    xhr.setRequestHeader('Authorization', `Bearer ${this.props.auth}`);
    xhr.send(data);

    return xhr;
  }

  startUpload(file: File): UploadProgress {
    const xhr = this.createUpload(file);
    const progress = new UploadProgress(file, xhr);

    progress.finished.catch(err => {
      this.addError(err);
    }).then(() => {
      this.setState(state => ({
        active: without(state.active, progress),
      }));
    });

    return progress;
  }

  enqueue(fileList: FileList) {
    return new Promise(resolve => {
      this.setState(state => {
        const files = Array.from(fileList);
        resolve();

        return {
          queue: state.queue.concat(files),
        };
      });
    });
  }

  setUploader(uploader: string) {
    localStorage.setItem('uploader', uploader);
    this.setState({uploader});
  }

  render() {
    return (
      <div>
        <button
          disabled={this.state.queue.length > 0}
          onClick={() => { this.props.onDoneUploading(); }}
        >{`Return to album`}</button>

        <label>
          {`What's your name?`}
          <input
            type='text'
            value={this.state.uploader}
            onChange={e => { this.setUploader(e.target.value); }}
          />
        </label>

        { this.renderErrors() }
        { this.renderActiveUploads() }
        { this.renderQueuedUploads() }
        { this.renderForm() }
      </div>
    );
  }

  renderErrors() {
    return this.state.errors.map((error, i) =>
      <p key={i}>{`Error: ${error.message}`}</p>
    );
  }

  renderActiveUploads() {
    if (this.state.active.length > 0) {
      return (
        <ul>{
          this.state.active.map((progress, i) =>
            <li key={progress.identifier}>
              <UploadProgressComponent
                uploadProgress={progress}
              ></UploadProgressComponent>
            </li>
          )
        }</ul>
      );
    }
  }

  renderQueuedUploads() {
    if (this.state.queue.length > 0) {
      return <p>{`${this.state.queue.length} files waiting in queue`}</p>;
    }
  }

  renderForm() {
    if (this.state.uploader) {
      return (
        <form
          onSubmit={e => {
            e.preventDefault();
            const form = e.target;
            this.enqueue(form.elements.namedItem('uploads').files).
              then(() => form.reset());
          }}
        >
          <input type='file' name='uploads' multiple></input>
          <input type='submit' value='Begin upload'></input>
        </form>
      );
    }
  }
}
