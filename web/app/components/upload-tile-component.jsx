// @flow
import React from 'react';
import {Upload} from 'app/models/upload';

const RIGHT_CLICK_EVENT = 2;

export class UploadTileComponent extends React.Component {
  props: {
    upload: Upload,
    onSelect: () => void,
  };

  decideClick(e: MouseEvent) {
    const newTab =
      e.which === RIGHT_CLICK_EVENT || e.metaKey || e.ctrlKey;

    if (!newTab) {
      e.preventDefault();
      this.props.onSelect();
    }
  }

  render() {
    return (
      <div className='upload-tile'>
        <a
          className='upload-tile__link'
          href={this.props.upload.fileUrl}
          target='_blank'
          rel='noopener noreferrer'
          onClick={e => this.decideClick(e)}
        >
          {
            (this.props.upload.type === 'image')
              ? this.renderAsImage()
              : this.renderAsVideo()
          }
        </a>
        <div className='upload-tile__uploader'>{`Uploaded by ${this.props.upload.uploader}`}</div>
      </div>
    );
  }

  renderAsImage() {
    return <img
      className='upload-tile__image'
      src={this.props.upload.previewUrl || this.props.upload.fileUrl}
    />;
  }

  renderAsVideo() {
    if (this.props.upload.previewUrl) {
      return this.renderAsImage();
    } else {
      return <div className='upload-tile__video'>Video</div>;
    }
  }
}

