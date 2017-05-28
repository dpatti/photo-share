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
        <img
          className='upload-tile__preview'
          src={this.props.upload.previewUrl || this.props.upload.fileUrl}
        />
        <div className='upload-tile__uploader'>{`Uploaded by ${this.props.upload.uploader}`}</div>
      </div>
    );
  }
}

