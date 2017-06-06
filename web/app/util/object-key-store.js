// @flow
import {uniqueId} from 'lodash';
import upsert from 'app/util/map-upsert';

type Lookup<T> = T => string;

const StoreMap = WeakMap || Map;

export default <K>(): Lookup<K> => {
  const store = new StoreMap();

  return (key: K): string => upsert(store, key, _ => uniqueId());
};
