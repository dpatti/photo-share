// @flow
module.exports = (name: string) =>
  class extends Error {
    constructor(message: string) {
      super(message);
      this.name = name;
      Error.captureStackTrace(this, this.constructor);
    }
  };
