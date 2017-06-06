// @flow

interface Maplike<K, V> {
  has(key: K): boolean,
  get(key: K): V | void,
  set(key: K, value: V): mixed,
}

export default <K, V>(map: Maplike<K, V>, key: K, upsert: K => V): V => {
  const mapValue = map.get(key);

  if (mapValue !== undefined) {
    return mapValue;
  } else {
    const newValue = upsert(key);
    map.set(key, newValue);
    return newValue;
  }
};
