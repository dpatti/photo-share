// @flow
import {assign, reduce} from 'lodash';

export const withParams = (relativeUrl: string, params: Keyed<string>): string => {
  return reduce(params, (url, value, key) => {
    url.searchParams.append(key, value);
    return url;
  }, new URL(relativeUrl, location.href)).href;
};

export const withAuth = (token: string, options: RequestOptions): RequestOptions => {
  const headers = new Headers(options.headers || {});
  headers.set('authorization', `Bearer ${token}`);

  return assign({}, options, {headers});
};

const apiFetch = (url: string, options?: RequestOptions): Promise<JSONValue> =>
  fetch(url, options).
    then(response =>
      response.ok
        ? response.json()
        : response.text().then(message => Promise.reject(Error(message)))
    );

const withMethod = (method: string, options?: RequestOptions): RequestOptions =>
  assign({}, options || {}, {method});

export const get = (url: string, options?: RequestOptions): Promise<JSONValue> =>
  apiFetch(url, withMethod('get', options));

export const post = (url: string, options?: RequestOptions): Promise<JSONValue> =>
  apiFetch(url, withMethod('post', options));
