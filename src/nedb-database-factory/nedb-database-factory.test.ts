import path from 'node:path';

import { NedbDatabaseFactory } from './nedb-database-factory';

describe('NedbDatabaseFactory', () => {
  test('should create a NeDb database', async () => {
    const NEDB_TEST_DATASTORE_FILE_PATH = path.join(
      // eslint-disable-next-line unicorn/prefer-module
      __dirname,
      '..',
      '..',
      'data',
      'test.db',
    );
    const datastore = await NedbDatabaseFactory.create(
      NEDB_TEST_DATASTORE_FILE_PATH,
    );
    expect(datastore).toBeDefined();
  });
});
