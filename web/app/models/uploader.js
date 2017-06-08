// @flow
import {assign} from 'lodash';

export class Uploader {
  id: number;
  name: string;
  uploads: number;

  constructor(object: $Shape<Uploader>) {
    assign(this, object);
  }
}
