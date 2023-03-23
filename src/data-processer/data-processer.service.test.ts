import path from 'node:path';

import { NedbDatabaseFactory } from '../nedb-database-factory/nedb-database-factory';
import { DataProcesserService } from './data-processer.service';

describe('DataProcesserService', () => {
  let service: DataProcesserService;

  beforeAll(() => {
    service = new DataProcesserService();
  });

  test('should get data from page and save to database', async () => {
    const PATH_TO_NEDB_DATABASE = path.join(
      // eslint-disable-next-line unicorn/prefer-module
      __dirname,
      '..',
      '..',
      'data',
      'test-books.db',
    );
    const datastore = NedbDatabaseFactory.create(PATH_TO_NEDB_DATABASE);
    // eslint-disable-next-line no-magic-numbers
    for (let pageNumber = 1; pageNumber < 10; pageNumber++) {
      console.log(`Page number: ${pageNumber}`);
      const URL_FOR_SCRAPPING = `https://books.toscrape.com/catalogue/page-${pageNumber}.html`;
      const data = await service.getDataFromUrl(URL_FOR_SCRAPPING);
      await service.saveDataToDatabase(data, datastore);
    }
    const data = await datastore.find({});
    expect(data).toBeDefined();
  });
});
