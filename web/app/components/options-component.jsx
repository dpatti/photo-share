// @flow
import React from 'react';

export class OptionsComponent extends React.Component {
  props: {
    onRequestUpload: () => void,
  };

  render() {
    return (
      <div className='options'>
        <button
          className='options__upload button'
          onClick={this.props.onRequestUpload}
        >{
          'Add your own images or videos'
        }</button>
      </div>
    );
  }
}
