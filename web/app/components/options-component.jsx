// @flow
import React from 'react';

export class OptionsComponent extends React.Component {
  props: {
    onRequestUpload: () => void,
  };

  render() {
    return (
      <div className='options'>
        <button onClick={this.props.onRequestUpload}>{
          `Upload images or videos`
        }</button>
      </div>
    );
  }
}
