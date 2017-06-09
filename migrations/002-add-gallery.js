// @flow
import type Sequelize from 'sequelize';
import type QueryInterface from 'sequelize/lib/query-interface';

exports.up = async (db: QueryInterface, Sequelize: Sequelize) => {
  return db.addColumn('uploads', 'galleryUrl', {
    type: Sequelize.STRING,
    null: true
  });
};

exports.down = async (db: QueryInterface, Sequelize: Sequelize) => {
  return db.dropColumn('uploads', 'galleryUrl');
};
