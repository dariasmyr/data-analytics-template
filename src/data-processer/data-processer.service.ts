import path from 'node:path';

import Datastore from '@seald-io/nedb';
import axios from 'axios';

import { Logger } from '../logger/logger';
import { NedbDatabaseFactory } from '../nedb-database-factory/nedb-database-factory';

export class DataProcesserService {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('DataProcesserService');
  }

  // Use this function to create NeDB database to collect and operate with raw data

  async createNedbDatabase(): Promise<Datastore> {
    const NEDB_DATASTORE_FILE_PATH = path.join(
      // eslint-disable-next-line unicorn/prefer-module
      __dirname,
      '..',
      'data',
      'data.db',
    );
    const datastore = await NedbDatabaseFactory.create(
      NEDB_DATASTORE_FILE_PATH,
    );
    if (datastore) {
      this.logger.debug('Database created');
    }
    return datastore;
  }

  /**
   * Fetches url data from a given URL and saves it to a datastore.
   * @param url - The URL to fetch site data from.
   * @returns A Promise that resolves to a boolean value indicating whether the operation was successful.
   */

  async getDataFromUrl(url: string): Promise<{
    url: string;
    data: string;
  }> {
    const response = await axios.get(url);
    const htmlData = response.data;
    if (!htmlData) {
      throw new Error(`No data received from ${url}`);
    }
    return {
      url,
      data: htmlData,
    };
  }

  async saveDataToDatabase(
    data: {
      url: string;
      data: string;
    },
    datastore: Datastore,
  ): Promise<boolean> {
    const { url, data: htmlData } = data;
    const savedUrls = await datastore.find({});

    const savedUrlsSet = new Set(savedUrls.map(() => url));
    if (savedUrlsSet.has(url)) {
      this.logger.debug(`URL ${url} already saved`);
    }
    const insertResult = await datastore.insertAsync({
      url,
      data: htmlData,
    });
    if (insertResult) {
      this.logger.debug(`URL ${url} saved`);
      return true;
    } else {
      this.logger.debug(`URL ${url} not saved`);
      return false;
    }
  }
}
