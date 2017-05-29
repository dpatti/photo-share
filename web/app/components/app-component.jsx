// @flow
import React from 'react';
import {AuthComponent} from './auth-component';
import {AlbumComponent} from './album-component';

export class AppComponent extends React.Component {
  state: {
    auth: ?string,
  };

  constructor() {
    super();
    this.state = {
      auth: localStorage.getItem('auth'),
    };
  }

  setAuth(token: string) {
    localStorage.setItem('auth', token);
    this.setState({auth: token});
  }

  render() {
    return (this.state.auth == null)
      ? <AuthComponent
          onSuccess={token => this.setAuth(token)}
        />
      : <AlbumComponent
          auth={this.state.auth}
        />
      ;
  }
}
