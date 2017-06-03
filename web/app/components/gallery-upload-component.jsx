// @flow
import React from 'react';
import {Upload} from 'app/models/upload';

export class GalleryUploadComponent extends React.Component {
  props: {
    upload: Upload,
  };

  imageSource() {
    return this.props.upload.galleryUrl || this.props.upload.fileUrl;
  }

  render() {
    return (
      <div
        className='gallery-upload'
      >
        <a
          className='gallery-upload__link'
          href={this.props.upload.fileUrl}
          target='_blank'
          rel='noopener noreferrer'
        >
          {
            (this.props.upload.type === 'image')
              ? this.renderAsImage()
              : this.renderAsVideo()
          }
        </a>
        <div className='gallery-upload__uploader'>{`Uploaded by ${this.props.upload.uploader}`}</div>
      </div>
    );
  }

  renderAsImage() {
    return (
      <img
        className='gallery-upload__preview'
        key={this.imageSource()}
        src={this.imageSource()}
      />
    );
  }

  renderAsVideo() {
    if (this.props.upload.previewUrl) {
      return this.renderAsImage();
    } else {
      return <div className='gallery-upload__video'>Click to Play</div>;
    }
  }
}
