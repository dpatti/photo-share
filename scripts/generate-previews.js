// @flow
const {delay} = require('bluebird');
const highland = require('highland');
const {isNull, map, max} = require('lodash');
const os = require('os');
const sequelize = require('sequelize');

require('app/services/reporting');
const logger = require('app/services/logger');
const {StoredFile, putPreview, putGallery} = require('app/services/storage');
const {Upload} = require('app/models');

const PROCESS_CONCURRENCY = Number(process.env.PROCESS_CONCURRENCY) || os.cpus().length;
const POLL_DELAY = Number(process.env.POLL_DELAY) || 1000;

const poll = <Obj, Iter>(f: Iter => Promise<[Array<Obj>, Iter]>, iter: Iter) => {
  return highland((push, next) => {
    const recurse = async (nextIter) => {
      await delay(POLL_DELAY);
      next(poll(f, nextIter));
    };

    (async () => {
      try {
        const [items, nextIter] = await f(iter);
        items.forEach(i => push(null, i));
        recurse(nextIter);
      } catch (err) {
        push(err);
        recurse(iter);
      }
    })();
  });
};

const allPreviewless = async (lastId: number): Promise<[Array<Upload>, number]> => {
  const condition =
    sequelize.and(
      {type: 'image', id: {$gt: lastId}},
      sequelize.or(
        {previewUrl: {$eq: null}},
        {galleryUrl: {$eq: null}}
      )
    );

  const uploads = await Upload.findAll({
    where: condition,
    order: [['id', 'ASC']],
    logging: false,
  });

  return [uploads, max(map(uploads, 'id')) || lastId];
};

const generatePreview = (upload: Upload) =>
  highland((async () => {
    const storedFile = await StoredFile.fromRemote({url: upload.fileUrl});

    if (isNull(upload.previewUrl)) {
      logger.info(`Generating preview for upload ${upload.id} (${upload.filename})`);
      const {url} = await putPreview(storedFile);

      upload.previewUrl = url;
      await upload.save();
    }

    if (isNull(upload.galleryUrl)) {
      logger.info(`Generating gallery for upload ${upload.id} (${upload.filename})`);
      const {url} = await putGallery(storedFile);

      upload.galleryUrl = url;
      await upload.save();
    }

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
