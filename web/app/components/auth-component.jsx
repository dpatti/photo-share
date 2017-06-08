// @flow
import React from 'react';
import jsonBlob from 'app/util/json-blob';
import {post} from 'app/util/api';

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

    post('/auth', {body: jsonBlob({password})}).then(response => {
      if (response && typeof response.token === 'string') {
        this.props.onSuccess(response.token);
      } else {
        throw Error('Unexpected auth API response');
      }
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
            autoCorrect='off'
            autoCapitalize='off'
            spellCheck='false'
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
