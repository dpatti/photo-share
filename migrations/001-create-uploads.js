// @flow
import type Sequelize from 'sequelize';
import type QueryInterface from 'sequelize/lib/query-interface';

exports.up = async (db: QueryInterface, Sequelize: Sequelize) => {
  return db.createTable('uploads', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    filename: {
      type: Sequelize.STRING,
      allowNull: false
    },
    type: {
      type: Sequelize.ENUM('image', 'video'),
      allowNull: false
    },
    uploader: {
      type: Sequelize.STRING,
      allowNull: false
    },
    fileUrl: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    previewUrl: {
      type: Sequelize.STRING,
      null: true
    },
  });
};

exports.down = async (db: QueryInterface, Sequelize: Sequelize) => {
  return db.dropTable('uploads');
};
