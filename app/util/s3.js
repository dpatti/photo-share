// @flow
const {S3} = require('aws-sdk');

type ClientParams = {|
  key: string,
  secret: string,
  signatureVersion: 'v2' | 'v4',
|};

exports.createClient = (params: ClientParams): Client =>
  new S3({
    accessKeyId: params.key,
    secretAccessKey: params.secret,
    signatureVersion: params.signatureVersion,
  });

type PutParams = {|
  bucket: string,
  path: string,
  source: stream$Readable,
  contentType: string,
|};

type PutResult = {|
  url: string,
  etag: string,
|};

exports.put = (client: Client, params: PutParams): Promise<PutResult> =>
  new S3.ManagedUpload({
    params: {
      Bucket: params.bucket,
      Key: params.path.slice(1),
      Body: params.source,
      ContentType: params.contentType,
    },
    service: client,
  }).promise().then(result => ({
    url: result.Location,
    etag: result.ETag,
  }));
