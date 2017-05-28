// @flow
const Sequelize = require('sequelize');
const database = require('app/services/database');

type UploadType = 'image' | 'video';

const Upload = exports.Upload = database.define('upload', {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  filename: {type: Sequelize.STRING, allowNull: false},
  type: {type: Sequelize.ENUM('image', 'video'), allowNull: false},
  uploader: {type: Sequelize.STRING, allowNull: false},
  fileUrl: {type: Sequelize.STRING, allowNull: false},
  previewUrl: {type: Sequelize.STRING, null: true},
}, {
  timestamps: true,
  paranoid: true,
  version: false,
});

const mimeMap: Keyed<UploadType> = {
  'image/gif': 'image',
  'image/jpeg': 'image',
  'image/png': 'image',

  'video/mpeg': 'video',
  'video/ogg': 'video',
  'video/webm': 'video',
};

Upload.inferType = (mimeType: string): ?UploadType =>
  mimeMap[mimeType];
