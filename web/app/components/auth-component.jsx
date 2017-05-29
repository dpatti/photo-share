// @flow
import React from 'react';
import jsonBlob from 'app/util/json-blob';

export class AuthComponent extends React.Component {
  props: {
    onSuccess: (string => void),
  };

  state: {
    loading: boolean,
    error: ?string,
  };

  constructor() {
    super();
    this.state = {
      loading: false,
      error: null,
    };
  }

  submitAuth(password: string) {
    this.setState({loading: true});

    fetch('/auth', {
      method: 'POST',
      body: jsonBlob({password}),
    }).then(response =>
      response.ok
        ? response.json()
        : response.text().then(message => Promise.reject(Error(message)))
    ).then(response => {
      this.props.onSuccess(response.token);
    }).catch(err => {
      this.error(err.message);
    });
  }

  error(message: string) {
    this.setState({error: message});
    this.setState({loading: false});
  }

  render() {
    return (
      <div className='auth'>
        <p className='auth__message'>{"Hey there, what's the password?"}</p>
        <form
          onSubmit={e => {
            e.preventDefault();
            this.submitAuth(e.target.elements.namedItem('password').value);
          }}
        >
          <input
            className='auth__input'
            name='password'
            type='text'
            autoComplete='off'
            disabled={this.state.loading}
          ></input>
          <input
            className='auth__submit'
            type='submit'
            value='Go'
            disabled={this.state.loading}
          ></input>
        </form>
        {
          (this.state.error)
            ? <div className='auth__error'>{this.state.error}</div>
            : null
        }
      </div>
    );
  }
}
