// @flow
import React from 'react';
import {Upload} from 'app/models/upload';
import {UploadTileComponent} from 'app/components/upload-tile-component';

export class UploadCollectionComponent extends React.Component {
  props: {
    uploads: Array<Upload>,
  };

  render() {
    return (
      <div className='upload-collection'>
        {
          this.props.uploads.map(upload =>
            <UploadTileComponent
              key={upload.id}
              upload={upload}
            />
          )
        }
      </div>
    );
  }
}

