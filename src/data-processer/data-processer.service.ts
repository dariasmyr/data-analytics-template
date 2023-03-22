import path from 'node:path';

import Datastore from '@seald-io/nedb';
import axios from 'axios';
import cheerio from 'cheerio';

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
   * @param datastore - The datastore to save the url data to.
   * @returns A Promise that resolves to a boolean value indicating whether the operation was successful.
   */

  async getArticleDataFromUrl(
    url: string,
    datastore: Datastore,
  ): Promise<boolean> {
    const savedUrls = await datastore.find({});
    const savedUrlsSet = new Set(savedUrls.map(() => url));

    if (savedUrlsSet.has(url)) {
      this.logger.debug(`URL ${url} already exists in datastore`);
      return false;
    } else {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const urlHtmlData = $.html();
      try {
        await datastore.insert({
          url,
          urlHtmlData,
        });
        this.logger.debug(`Inserted ${url} into datastore`);
        return true;
      } catch {
        this.logger.error(`Failed to insert ${url} into datastore`);
        return false;
      }
    }
  }
}
