// @flow
import React from 'react';

import {UploadProgress} from 'app/models/upload-progress';

export class UploadProgressComponent extends React.Component {
  props: {
    uploadProgress: UploadProgress,
  };

  state: {
    percentage: number,
  };

  constructor() {
    super();
    this.state = {
      percentage: 0,
    };
  }

  componentWillMount() {
    this.reset();
  }

  componentDidUpdate(prevProps: $PropertyType<UploadProgressComponent, 'props'>) {
    if (this.props.uploadProgress !== prevProps.uploadProgress) {
      this.reset();
    }
  }

  reset() {
    this.setState({
      percentage: 0,
    });

    this.props.uploadProgress.on('progress', percentage => {
      this.setState({percentage});
    });
  }

  render() {
    return (
      <p>{`Uploading ${this.props.uploadProgress.filename} (${this.state.percentage}%)`}</p>
    );
  }
}
