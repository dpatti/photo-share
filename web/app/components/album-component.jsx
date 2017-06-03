// @flow
import React from 'react';
import {throttle, uniqBy} from 'lodash';
import {Upload} from 'app/models/upload';
import {OptionsComponent} from 'app/components/options-component';
import {UploaderComponent} from 'app/components/uploader-component';
import {UploadCollectionComponent} from 'app/components/upload-collection-component';
import {GalleryComponent} from 'app/components/gallery-component';

export class AlbumComponent extends React.Component {
  props: {
    auth: string,
  };

  state: {
    loaded: Array<Upload>,
    hasMore: boolean,
    isUploading: boolean,
    activeImage: ?number,
  };

  constructor() {
    super();
    this.state = {
      loaded: [],
      hasMore: true,
      isUploading: false,
      activeImage: null,
    };
  }

  componentWillMount() {
    this.loadMore();
  }

  handleScroll(e: Event) {
    // TODO: Probably just replace this with some actual infinite scrolling
    // implementation
    // eslint-disable-next-line flowtype/no-weak-types
    const el = (e.target: any);
    if (el.scrollTop + el.clientHeight >= 0.9 * el.scrollHeight && this.state.hasMore) {
      this.loadMore();
    }
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

  gallerySwitch(activeImage: ?number) {
    this.setState({activeImage});

    if (this.state.hasMore && activeImage === this.state.loaded.length - 1) {
      this.loadMore();
    }
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
      <div
        className='album'
        onScroll={throttle(e => this.handleScroll(e), 100, {trailing: false})}
      >
        <OptionsComponent
          onRequestUpload={() => { this.setState({isUploading: true}); }}
        />
        <UploadCollectionComponent
          uploads={this.state.loaded}
          onSelectUpload={i => this.gallerySwitch(i)}
        />
        {
          (this.state.activeImage == null)
            ? null
            : <GalleryComponent
                activeUpload={this.state.loaded[this.state.activeImage]}
                index={this.state.activeImage}
                total={this.state.loaded.length}
                onGallerySwitch={i => this.gallerySwitch(i)}
              />
        }
      </div>
    );
  }
}
