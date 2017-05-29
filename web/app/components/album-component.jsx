// @flow
import React from 'react';
import {uniqBy} from 'lodash';
import {Upload} from 'app/models/upload';
import {OptionsComponent} from 'app/components/options-component';
import {UploaderComponent} from 'app/components/uploader-component';
import {UploadCollectionComponent} from 'app/components/upload-collection-component';

export class AlbumComponent extends React.Component {
  props: {
    auth: string,
  };

  state: {
    loaded: Array<Upload>,
    hasMore: boolean,
    isUploading: boolean,
  };

  constructor() {
    super();
    this.state = {
      loaded: [],
      hasMore: true,
      isUploading: false,
    };
  }

  componentWillMount() {
    this.loadMore();
  }

  loadMore() {
    fetch(`/uploads?from=${this.state.loaded.length}`, {
      headers: new Headers({
        authorization: `Bearer ${this.props.auth}`,
      })
    }).then(response =>
      (response.ok)
        ? response.json()
        : response.text().then(message => Promise.reject(Error(message)))
    ).then(uploads => {
      this.setState({
        loaded: uniqBy(this.state.loaded.concat(uploads), 'id'),
        hasMore: uploads.length > 0,
      });
    });
  }

  doneUploading() {
    this.setState({
      loaded: [],
      hasMore: true,
      isUploading: false,
    }, () => { this.loadMore(); });
  }

  render() {
    return (this.state.isUploading)
      ? this.renderUploader()
      : this.renderAlbum();
  }

  renderUploader() {
    return (
      <UploaderComponent
        auth={this.props.auth}
        onDoneUploading={() => { this.doneUploading(); }}
      />
    );
  }

  renderAlbum() {
    return (
      <div className='album'>
        <OptionsComponent
          onRequestUpload={() => { this.setState({isUploading: true}); }}
        />
        <UploadCollectionComponent uploads={this.state.loaded} />
        {
          this.state.hasMore
            ? <button onClick={_ => this.loadMore()}>Load more</button>
            : null
        }
      </div>
    );
  }
}
