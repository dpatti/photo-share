// @flow
import classNames from 'classnames';
import React from 'react';
import {first, isEmpty, without} from 'lodash';

import {UploadProgress} from 'app/models/upload-progress';
import {UploadProgressComponent} from './upload-progress-component';

const UPLOAD_CONCURRENCY = 4;
const ERROR_LIMIT = 5;

export class UploaderComponent extends React.Component {
  form: HTMLFormElement;

  props: {
    auth: string,
    onDoneUploading: () => void,
  };

  state: {
    uploader: string,
    errors: Array<Error>,
    dropActive: boolean,
    staged: Array<File>,
    queue: Array<File>,
    active: Array<UploadProgress>,
  };

  constructor() {
    super();
    this.state = {
      uploader: localStorage.getItem('uploader') || '',
      errors: [],
      dropActive: false,
      staged: [],
      queue: [],
      active: [],
    };
  }

  componentDidUpdate(_: mixed, prevState: $PropertyType<UploaderComponent, 'state'>) {
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

  createUpload(file: File): UploadProgress {
    const data = new FormData();
    data.append('uploadFile', file);
    data.append('uploader', this.state.uploader);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/uploads', true);
    xhr.setRequestHeader('Authorization', `Bearer ${this.props.auth}`);

    const progress = new UploadProgress(file, xhr);
    xhr.send(data);

    return progress;
  }

  startUpload(file: File): UploadProgress {
    const progress = this.createUpload(file);

    progress.finished.catch(err => {
      this.addError(err);
    }).then(() => {
      this.setState(state => ({
        active: without(state.active, progress),
      }));
    });

    return progress;
  }

  enqueueAll() {
    this.setState(state => ({
      queue: state.queue.concat(state.staged),
      staged: [],
    }));
  }

  setUploader(uploader: string) {
    localStorage.setItem('uploader', uploader);
    this.setState({uploader});
  }

  selectFiles(fileInput: HTMLInputElement) {
    const files = Array.from(fileInput.files);

    new Promise(resolve => {
      this.setState(state => {
        resolve();

        return {
          staged: state.staged.concat(files),
        };
      });
    }).then(() => {
      this.form.reset();
    });
  }

  toggleDropActive(dropActive: boolean) {
    if (this.state.dropActive !== dropActive) {
      this.setState({dropActive});
    }
  }

  dropFiles(e: DragEvent) {
    e.preventDefault();

    if (e.dataTransfer && e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      this.setState(state => ({
        staged: state.staged.concat(files),
      }));
    }
  }

  render() {
    return (
      <div className='uploader'>
        <button
          className='uploader__back button'
          disabled={this.state.queue.length > 0}
          onClick={() => { this.props.onDoneUploading(); }}
        >{'Return to album'}</button>

        { this.renderErrors() }
        { this.renderActiveUploads() }
        { this.renderQueuedUploads() }

        <label className='uploader__name-label'>
          {"What's your name?"}
          <input
            className='uploader__name-input'
            type='text'
            value={this.state.uploader}
            onChange={e => { this.setUploader(e.target.value); }}
          />
        </label>

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
          this.state.active.map(progress =>
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
          className='uploader__form'
          ref={form => { this.form = form; }}
          onSubmit={e => {
            e.preventDefault();
            this.enqueueAll();
          }}
        >
          <label
            className={classNames('uploader__file-label', {
              'uploader__file-label--dropping': this.state.dropActive,
            })}
            onDragOver={e => {
              e.preventDefault();
              this.toggleDropActive(true);
            }}
            onDragLeave={_ => { this.toggleDropActive(false); }}
            onDrop={e => {
              this.toggleDropActive(false);
              this.dropFiles(e);
            }}
          >
            {
              (this.state.staged.length > 0)
                ? <p>{`${this.state.staged.length} file(s) selected`}</p>
                : null
            }
            <p>{'Drag files here to upload or click to select'}</p>
            <input
              className='uploader__file-input'
              type='file'
              name='uploads'
              onChange={e => this.selectFiles(e.target)}
              multiple
            ></input>
          </label>

          <input
            className='uploader__submit button'
            type='submit'
            value='Begin upload'
            disabled={isEmpty(this.state.staged)}
          ></input>
        </form>
      );
    }
  }
}
