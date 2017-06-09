// @flow
const Sequelize = require('sequelize');
const database = require('app/services/database');

export type UploadType = 'image' | 'video';

const Upload = exports.Upload = database.define('upload', {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  filename: {type: Sequelize.STRING, allowNull: false},
  type: {type: Sequelize.ENUM('image', 'video'), allowNull: false},
  uploader: {type: Sequelize.STRING, allowNull: false},
  fileUrl: {type: Sequelize.STRING, allowNull: false, unique: true},
  previewUrl: {type: Sequelize.STRING, null: true},
  galleryUrl: {type: Sequelize.STRING, null: true},
}, {
  timestamps: true,
  paranoid: true,
  version: false,
});

const mimeMap: Keyed<UploadType> = {
  'image/gif': 'image',
  'image/jpeg': 'image',
  'image/png': 'image',

  'video/mp4': 'video',
  'video/mpeg': 'video',
  'video/ogg': 'video',
  'video/quicktime': 'video',
  'video/webm': 'video',
};

Upload.inferType = (mimeType: string): ?UploadType =>
  mimeMap[mimeType] || null;

Upload.whereUploader = (uploader: ?string) =>
  (uploader)
    ? Sequelize.where(Sequelize.fn('lower', Sequelize.col('uploader')), uploader)
    : {};
