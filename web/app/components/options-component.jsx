// @flow
import classnames from 'classnames';
import React from 'react';
import {sumBy} from 'lodash';
import {Uploader} from 'app/models/uploader';

export class OptionsComponent extends React.Component {
  props: {
    uploaders: Array<Uploader>,
    filterFrom: ?Uploader,
    onRequestFilter: ?Uploader => void,
    onRequestUpload: () => void,
  };

  totalUploads(): number {
    return sumBy(this.props.uploaders, 'uploads');
  }

  render() {
    return (
      <div className='options'>
        <button
          className='options__upload button'
          onClick={this.props.onRequestUpload}
        >{'Add your own images or videos'}</button>

        <div>
          <p>{'Show uploads from'}</p>
          <ul className='options__uploaders'>
            <li>{
              this.renderFilter(null, 'All Users', this.totalUploads())
            }</li>

            {
              this.props.uploaders.map(uploader =>
                <li key={uploader.id}>{
                  this.renderFilter(uploader, uploader.name, uploader.uploads)
                }</li>
              )
            }
          </ul>
        </div>
      </div>
    );
  }

  renderFilter(selection: ?Uploader, label: string, count: number) {
    return (
      <button
        className={classnames('options__uploader button', {
          'options__uploader--active': selection === this.props.filterFrom,
        })}
        onClick={_ => this.props.onRequestFilter(selection)}
      >{`${label} (${count})`}</button>
    );
  }
}
