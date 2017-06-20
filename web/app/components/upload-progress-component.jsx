// @flow
import React from 'react';

import {UploadProgress} from 'app/models/upload-progress';
import {ProgressComponent} from './progress-component';

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
      <ProgressComponent
        color='green'
        progress={this.state.percentage}
        total={100}
        label={`Uploading ${this.props.uploadProgress.filename}`}
      />
    );
  }
}
