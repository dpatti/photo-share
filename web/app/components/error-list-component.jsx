// @flow
import React from 'react';
import {map} from 'lodash';

import {RetryableError} from 'app/models/retryable-error';
import objectKeyStore from 'app/util/object-key-store';

// This normally would be inlined at the one place we use it, but flow does not
// let you use a refinement in a callback when the binding is mutable (a la
// `let`). In the case of a function argument, the binding is always mutable, so
// we would need to check `instanceof` in the callback too.
const withRetryable = <T>(error: Error, f: RetryableError => T): ?T => {
  if (error instanceof RetryableError) {
    return f(error);
  } else {
    return null;
  }
};

const errorKey = objectKeyStore();

export class ErrorListComponent extends React.Component {
  props: {
    errors: Array<Error>,
    onReplace: (Error, Error) => void,
    onDismiss: Error => void,
  };

  async retry(error: RetryableError) {
    try {
      await error.retry();
    } catch (newError) {
      this.props.onReplace(error, RetryableError.from(newError, error.retry));
    }
    this.props.onDismiss(error);
  }

  dismiss(error: Error) {
    this.props.onDismiss(error);
  }

  render() {
    return (
      <ul className='error-list'>{
        map(this.props.errors, error =>
          <li className='error-list__item' key={errorKey(error)}>
            <div className='error-list__item-message'>{
              `Error: ${error.message}`
            }</div>
            {
              withRetryable(error, retryableError =>
                <button
                  className='error-list__item-button'
                  onClick={_ => this.retry(retryableError)}
                >Retry</button>
              )
            }
            <button
              className='error-list__item-button'
              onClick={_ => this.dismiss(error)}
            >Dismiss</button>
          </li>
        )
      }</ul>
    );
  }
}
