// @flow
const {createHash} = require('crypto');
const {createReadStream} = require('fs');
const {join, parse: parsePath, sep} = require('path');
const {URL} = require('url');

const {last} = require('lodash');
const {lookup} = require('mime-types');
const request = require('request');

const {storage: config} = require('./config');
const {PREVIEW_MIME_TYPE, generate} = require('app/services/previewer');
const {fromStream} = require('app/util/promise');
const s3 = require('app/util/s3');

const s3Client = s3.createClient({
  key: config.key,
  secret: config.secret,
  signatureVersion: 'v4',
});

const s3Url = (bucket: string, path: string): string =>
  `https://${bucket}.s3.amazonaws.com/${path}`;

class StoredFile {
  filename: string;
  hash: string;
  source: () => stream$Readable;

  constructor(o: {filename: string, hash: string, source: () => stream$Readable}) {
    this.filename = o.filename;
    this.hash = o.hash;
    this.source = o.source;
  }

  static async fromLocal({filename, path}: {filename: string, path: string}): Promise<StoredFile> {
    const hash = await fromStream(createReadStream(path).pipe(createHash('md5')));

    return new StoredFile({
      filename,
      hash: hash.toString('hex'),
      source: () => createReadStream(path),
    });
  }

  static async fromRemote({url}: {url: string}): Promise<StoredFile> {
    const {dir, base} = parsePath(new URL(url).pathname);

    return new StoredFile({
      filename: base,
      hash: last(dir.split(sep)),
      source: () => request(url),
    });
  }

  remoteUrl(): URL {
    return this._urlFor(this.filename);
  }

  previewUrl(): URL {
    const {name} = parsePath(this.filename);
    return this._urlFor(`${name}_preview.jpg`);
  }

  mimeType(): string {
    return lookup(this.filename);
  }

  read(): stream$Readable {
    return this.source();
  }

  generatePreview(): stream$Readable {
    return generate(this.read(), this.mimeType());
  }

  _urlFor(filename: string): URL {
    return new URL(s3Url(config.bucket, join(config.namespace, this.hash, filename)));
  }
}
exports.StoredFile = StoredFile;

exports.put = (file: StoredFile) =>
  s3.put(s3Client, {
    bucket: config.bucket,
    path: file.remoteUrl().pathname,
    source: file.read(),
    contentType: file.mimeType(),
  });

exports.putPreview = (file: StoredFile) =>
  s3.put(s3Client, {
    bucket: config.bucket,
    path: file.previewUrl().pathname,
    source: file.generatePreview(),
    contentType: PREVIEW_MIME_TYPE,
  });
