// @flow
import React from 'react';
import {get as getFrom, throttle, uniqBy} from 'lodash';
import {Upload} from 'app/models/upload';
import {Uploader} from 'app/models/uploader';
import {OptionsComponent} from 'app/components/options-component';
import {UploaderComponent} from 'app/components/uploader-component';
import {UploadCollectionComponent} from 'app/components/upload-collection-component';
import {GalleryComponent} from 'app/components/gallery-component';
import {get, withAuth, withParams} from 'app/util/api';
import {fromJSONArray} from 'app/util/from-json';

export class AlbumComponent extends React.Component {
  props: {
    auth: string,
  };

  state: {
    // Options
    uploaders: Array<Uploader>,
    filterFrom: ?Uploader,

    // Upload View
    isUploading: boolean,

    // Gallery
    activeImage: ?number,

    // Album
    loaded: Array<Upload>,
    hasMore: boolean,
  };

  constructor() {
    super();

    this.state = {
      uploaders: [],
      filterFrom: null,
      isUploading: false,
      activeImage: null,
      loaded: [],
      hasMore: true,
    };
  }

  componentWillMount() {
    this.loadInitial();
  }

  componentDidUpdate(_: mixed, prevState: $PropertyType<AlbumComponent, 'state'>) {
    if (this.state.filterFrom !== prevState.filterFrom) {
      // TODO: This is pretty ugly, and definitely opens us up to a race
      // condition. We definitely need a sort of async state management that can
      // simulate switchMap() from rxjs (or just use that? somehow?)
      this.setState({
        loaded: [],
        hasMore: true,
      }, () => {
        this.loadMore();
      });
    }
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

  loadInitial() {
    this.setState({
      uploaders: [],
      filterFrom: null,
      loaded: [],
      hasMore: true,
      isUploading: false,
    }, () => {
      this.loadUploaders();
      this.loadMore();
    });
  }

  loadUploaders() {
    get('/uploaders', withAuth(this.props.auth, {})).
      then(response => {
        this.setState({
          uploaders: fromJSONArray(Uploader, response),
        });
      });
  }

  loadMore() {
    get(
      withParams('/uploads', {
        from: String(this.state.loaded.length),
        by: getFrom(this.state.filterFrom, 'id', ''),
      }),
      withAuth(this.props.auth, {})
    ).
      then(response => {
        const uploads = fromJSONArray(Upload, response);

        this.setState({
          loaded: uniqBy(this.state.loaded.concat(uploads), 'id'),
          hasMore: uploads.length > 0,
        });
      });
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
        onDoneUploading={() => { this.loadInitial(); }}
      />
    );
  }

  renderAlbum() {
    return (
      <div
        className='album'
        onScroll={throttle(e => this.handleScroll(e), 100, {trailing: false})}
      >
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
        <OptionsComponent
          uploaders={this.state.uploaders}
          filterFrom={this.state.filterFrom}
          onRequestFilter={uploader => { this.setState({filterFrom: uploader}); }}
          onRequestUpload={() => { this.setState({isUploading: true}); }}
        />
        <UploadCollectionComponent
          uploads={this.state.loaded}
          onSelectUpload={i => this.gallerySwitch(i)}
        />
      </div>
    );
  }
}
