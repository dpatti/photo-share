// @flow
type RetryThunk = () => Promise<void>;

export class RetryableError extends Error {
  retry: RetryThunk;

  static from(error: Error, retry: RetryThunk) {
    return new RetryableError(error.message, retry);
  }

  constructor(message: string, retry: RetryThunk) {
    super(message);
    this.name = 'RetryableError';
    this.retry = retry;
    Error.captureStackTrace(this, this.constructor);
  }
}
