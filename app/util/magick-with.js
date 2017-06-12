// @flow
const gm = require('gm');
const {PassThrough} = require('stream');
const customError = require('./custom-error');

export type ImageTransform = gm => gm;

const OutputError = customError('OutputError');

module.exports = (source: stream$Readable, transform: ImageTransform): stream$Readable => {
  const image = transform(gm(source));
  const sink = new PassThrough();

  image.stream((err, stdout, stderr) => {
    if (err) {
      sink.emit('error', err);
      return;
    }

    stderr.on('data', data => {
      sink.emit('error', new OutputError(data.toString()));
    });

    stdout.pipe(sink);
  });

  return sink;
};
