// @flow
import {clamp} from 'lodash';
import React from 'react';

export class ProgressComponent extends React.Component {
  props: {
    progress: number,
    total: number,
    label: string,
  };

  percentage(): string {
    const percent = Math.round(100 * this.props.progress / this.props.total);

    return `${String(clamp(percent, 0, 100))}%`;
  }

  render() {
    return (
      <div className='progress'>
        <div
          className='progress__background'
          style={{width: this.percentage()}}
        ></div>
        <div className='progress__label'>{this.props.label}</div>
      </div>
    );
  }
}
