// @flow
const {delay} = require('bluebird');
const highland = require('highland');
const {map, max} = require('lodash');
const os = require('os');

require('app/services/reporting');
const logger = require('app/services/logger');
const {StoredFile, putPreview} = require('app/services/storage');
const {Upload} = require('app/models');

const PROCESS_CONCURRENCY = Number(process.env.PROCESS_CONCURRENCY) || os.cpus().length;
const POLL_DELAY = Number(process.env.POLL_DELAY) || 1000;

const poll = <Obj, Iter>(f: Iter => Promise<[Array<Obj>, Iter]>, init: Iter) => {
  return highland((async () => {
    const [items, next] = await f(init);

    return highland(items).
      concat(delay(POLL_DELAY).then(_ => poll(f, next)));
  })()).flatten();
};

const allPreviewless = async (lastId: number): Promise<[Array<Upload>, number]> => {
  const uploads = await Upload.findAll({
    where: {
      type: 'image',
      previewUrl: {$eq: null},
      id: {$gt: lastId},
    },
    order: [['id', 'ASC']],
    logging: false,
  });

  return [uploads, max(map(uploads, 'id')) || lastId];
};

const generatePreview = (upload: Upload) =>
  highland((async () => {
    logger.info(`Generating for upload ${upload.id} (${upload.filename})`);

    const storedFile = await StoredFile.fromRemote({url: upload.fileUrl});
    const {url} = await putPreview(storedFile);

    upload.previewUrl = url;
    await upload.save();

    return upload;
  })());

logger.info('Polling...');
poll(allPreviewless, 0).
  map(generatePreview).
  parallel(PROCESS_CONCURRENCY).
  errors(err => {
    logger.error(err.stack);
  }).
  each(result => {
    logger.info('Saved preview for:', result.id, result.filename);
  });
