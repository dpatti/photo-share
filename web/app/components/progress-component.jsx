// @flow
import classnames from 'classnames';
import {clamp} from 'lodash';
import React from 'react';

const colors = {
  green: 'progress__background--green',
  blue: 'progress__background--blue',
};

export class ProgressComponent extends React.Component {
  props: {
    color: $Keys<typeof colors>,
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
          className={classnames('progress__background', colors[this.props.color])}
          style={{width: this.percentage()}}
        ></div>
        <div className='progress__label'>{this.props.label}</div>
      </div>
    );
  }
}
