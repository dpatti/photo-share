// @flow
export default (json: JSONValue): Blob =>
  new Blob([JSON.stringify(json)], {type: 'application/json'});
