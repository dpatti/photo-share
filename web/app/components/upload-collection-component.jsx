// @flow
import React from 'react';
import {Upload} from 'app/models/upload';
import {UploadTileComponent} from 'app/components/upload-tile-component';

export class UploadCollectionComponent extends React.Component {
  props: {
    uploads: Array<Upload>,
    onSelectUpload: number => void,
  };

  render() {
    return (
      <div className='upload-collection'>
        {
          this.props.uploads.map((upload, i) =>
            <UploadTileComponent
              key={upload.id}
              upload={upload}
              onSelect={() => this.props.onSelectUpload(i)}
            />
          )
        }
      </div>
    );
  }
}

