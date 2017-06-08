// @flow
export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
    Error.captureStackTrace(this, this.constructor);
  }
}
