// @flow
const {first, groupBy, map, sumBy} = require('lodash');

const {Upload} = require('app/models');

exports.Uploader = class Uploader {
  id: string;
  name: string;
  uploads: number;

  constructor({id, name, uploads}: {|id: string, name: string, uploads: number|}) {
    this.id = id;
    this.name = name;
    this.uploads = uploads;
  }

  static async findAll(): Promise<Array<Uploader>> {
    const results: Array<{uploader: string, COUNT: string}> =
      await Upload.aggregate('*', 'COUNT', {
        attributes: ['uploader'],
        group: 'uploader',
        order: 'COUNT(*) desc',
        plain: false,
      });

    const uploaders =
      map(groupBy(results, r => r.uploader.toLowerCase()), (grouped, key) =>
        new Uploader({
          id: key,
          name: first(grouped).uploader,
          uploads: sumBy(grouped, r => Number(r.COUNT)),
        })
      );

    return uploaders;
  }
};
