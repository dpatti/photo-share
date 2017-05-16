// @flow
import React from 'react';
import {Upload} from 'app/models/upload';

export class AlbumComponent extends React.Component {
  props: {
    auth: string,
  };

  state: {
    loaded: Array<Upload>,
  };

  constructor() {
    super();
    this.state = {
      loaded: [],
    };
  }

  render() {
    return <div></div>;
  }
}
