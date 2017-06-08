// @flow
import {map} from 'lodash';

export const fromJSON = <T: *>(Type: Class<T>, json: JSONValue): T => {
  return new Type(json);
};

export const fromJSONArray = <T: *>(Type: Class<T>, json: JSONValue): Array<T> => {
  if (json instanceof Array) {
    // TODO: ugh, so having a covariant JSON array helps in some places but
    // hurts in others. That is, any method that takes arrays, whether it
    // mutates them or not, cannot take JSONArrays.
    return map(Array.from(json), r => new Type(r));
  } else {
    throw Error(`Expected JSON array, got ${typeof json}`);
  }
};
