// @flow
import classNames from 'classnames';
import React from 'react';
import {first, isEmpty, flatMap, map, partition, uniq, update, without} from 'lodash';
import {extname} from 'path';

import {NetworkError} from 'app/models/network-error';
import {RetryableError} from 'app/models/retryable-error';
import {Upload} from 'app/models/upload';
import {UploadProgress} from 'app/models/upload-progress';
import objectKeyStore from 'app/util/object-key-store';

import {UploadProgressComponent} from './upload-progress-component';
import {ErrorListComponent} from './error-list-component';
import {ProgressComponent} from './progress-component';

const UPLOAD_CONCURRENCY = 4;
const ERROR_LIMIT = 3;

const progressKey = objectKeyStore();

type Stats = {
  finished: number,
  queued: number,
};

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
    stats: Stats,
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
      stats: {
        finished: 0,
        queued: 0,
      },
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

  canNavigate() {
    return isEmpty(this.state.queue) && isEmpty(this.state.active);
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
      this.addError(
        (err instanceof NetworkError)
          ? RetryableError.from(err, () => this.retryUpload(file))
          : err
      );
    }).then(() => {
      // TODO: don't use setState in a promise without being able to cancel it
      // to prevent it from finishing after unmount
      this.setState(state => ({
        active: without(state.active, progress),
        stats: update(state.stats, 'finished', n => n + 1),
      }));
    });

    return progress;
  }

  retryUpload(file: File) {
    return new Promise((resolve, reject) => {
      try {
        const retry = this.startUpload(file);

        this.setState(state => {
          resolve();

          return {
            active: state.active.concat(retry),
          };
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  async stageFiles(files: Array<File>) {
    const [valid, invalid] =
      partition(files, f => Upload.isValidExtension(f.name));

    const invalidExtensions =
      uniq(map(invalid, f => extname(f.name))).join(', ');

    const groupedInvalid =
      isEmpty(invalidExtensions)
        ? []
        : Error(`You can't upload files with extension(s) ${invalidExtensions}`);

    return new Promise(resolve => {
      this.setState(state => {
        resolve();

        return {
          staged: state.staged.concat(valid),
          errors: state.errors.concat(groupedInvalid),
        };
      });
    });
  }

  enqueueAll() {
    this.setState(state => ({
      queue: state.queue.concat(state.staged),
      stats: update(state.stats, 'queued', n => n + 1),
      staged: [],
    }));
  }

  setUploader(uploader: string) {
    localStorage.setItem('uploader', uploader);
    this.setState({uploader});
  }

  async selectFiles(fileInput: HTMLInputElement) {
    const files = Array.from(fileInput.files);

    await this.stageFiles(files);
    this.form.reset();
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
      this.stageFiles(files);
    }
  }

  spliceError(target: Error, replacements: Array<Error>) {
    this.setState(state => ({
      errors: flatMap(state.errors, error =>
        (error === target) ? replacements : [error]
      ),
    }));
  }

  render() {
    return (
      <div className='uploader'>
        <button
          className='uploader__back button'
          disabled={!this.canNavigate()}
          onClick={() => { this.props.onDoneUploading(); }}
        >{'Return to album'}</button>

        { this.renderErrors() }
        { this.renderActiveUploads() }
        { this.renderUploadStats() }

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
    if (!isEmpty(this.state.errors)) {
      return (
        <ErrorListComponent
          errors={this.state.errors}
          onReplace={(a, b) => { this.spliceError(a, [b]); }}
          onDismiss={(err) => { this.spliceError(err, []); }}
        />
      );
    }
  }

  renderActiveUploads() {
    if (!isEmpty(this.state.active)) {
      return (
        <ul className='uploader__active-uploads'>{
          map(this.state.active, progress =>
            <li key={progressKey(progress)}>
              <UploadProgressComponent
                uploadProgress={progress}
              ></UploadProgressComponent>
            </li>
          )
        }</ul>
      );
    }
  }

  renderUploadStats() {
    if (this.state.stats.queued > 0) {
      return (
        <ProgressComponent
          progress={this.state.stats.finished}
          total={this.state.stats.queued}
          label={`${this.state.stats.finished} files uploaded`}
        />
      );
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
