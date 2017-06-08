// @flow
import React from 'react';
import {clamp} from 'lodash';
import {Upload} from 'app/models/upload';
import {GalleryUploadComponent} from 'app/components/gallery-upload-component';

const LEFT = 37;
const RIGHT = 39;
const ESC = 27;

type Direction = 'back' | 'forward';
const toDelta = {back: -1, forward: 1};

export class GalleryComponent extends React.Component {
  handler: KeyboardEvent => void;

  props: {
    activeUpload: Upload,
    index: number,
    total: number,
    onGallerySwitch: ?number => void,
  };

  componentDidMount() {
    this.handler = (e: KeyboardEvent) => { this.handleKeypress(e); };

    if (document.documentElement) {
      document.addEventListener('keyup', this.handler);
    }
  }

  componentWillUnmount() {
    if (document.documentElement) {
      document.removeEventListener('keyup', this.handler);
    }
  }

  handleKeypress(e: KeyboardEvent) {
    const withCancel = (value: mixed) => {
      e.preventDefault();
      e.stopPropagation();
      return value;
    };

    switch (e.keyCode) {
    case LEFT: return withCancel(this.navigate('back'));
    case RIGHT: return withCancel(this.navigate('forward'));
    case ESC: return withCancel(this.props.onGallerySwitch(null));
    }
  }

  navigate(direction: Direction) {
    const dest =
      clamp(this.props.index + toDelta[direction], 0, this.props.total - 1);

    this.props.onGallerySwitch(dest);
  }

  render() {
    return (
      <div className='gallery'>
        <div className='gallery__controls'>
          <button
            className='gallery__button gallery__close'
            onClick={() => this.props.onGallerySwitch(null)}
          >&#10799;</button>
        </div>

        <div className='gallery__display'>
          <button
            disabled={this.props.index === 0}
            className='gallery__button gallery__prev'
            onClick={() => this.navigate('back')}
          >&lang;</button>

          <div className='gallery__upload'>
            <GalleryUploadComponent
              upload={this.props.activeUpload}
            />
          </div>

          <button
            disabled={this.props.index === this.props.total - 1}
            className='gallery__button gallery__next'
            onClick={() => this.navigate('forward')}
          >&rang;</button>
        </div>
      </div>
    );
  }
}

