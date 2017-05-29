// @flow
import React from 'react';
import {Upload} from 'app/models/upload';

export class UploadTileComponent extends React.Component {
  props: {
    upload: Upload,
  };

  render() {
    return (
      <div className='upload-tile'>
        <a href={this.props.upload.fileUrl} target='_blank'>
          {
            (this.props.upload.type == 'image')
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
      className='upload-tile__preview'
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

