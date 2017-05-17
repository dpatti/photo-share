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
        [Upload]
      </div>
    );
  }
}

