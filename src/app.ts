import channelsJson from '../data/twitch-channels-template.json';
import { Logger } from './logger/logger';
import { NedbDatabaseFactory } from './nedb-database-factory/nedb-database-factory';
import { SqliteConverterService } from './sqlite-converter-service/sqlite-converter-service';

const logger = new Logger('App');

// Use this function to create NeDB database to collect and operate with raw data
async function createNedbDatabase() {
  const usersDatastore = NedbDatabaseFactory.create('..twitch-servers.db');
  if (usersDatastore) {
    logger.debug('Database created');
  }
  // Insert data to the database
  for (const channel of channelsJson) {
    const result = await usersDatastore.insertAsync(channel);
    if (result) {
      logger.debug('Data inserted');
    } else {
      logger.error('Error inserting data');
    }
  }
  // Interact with data from database
  const channelsCount = await usersDatastore.countAsync({});
  logger.debug('Channels count:', channelsCount);
}

// Use this function to convert the data from the JSON file to the SQLite database (with Prisma)
async function convertToSqlite() {
  const sqliteConverterService = new SqliteConverterService();
  const result = await sqliteConverterService.convertToSqlite(channelsJson);
  if (result) {
    logger.debug('Data saved to the database');
    await sqliteConverterService.prisma.$disconnect();
    logger.debug('Disconnected from the database');
  } else {
    logger.error('Error saving data to the database');
    await sqliteConverterService.prisma.$disconnect();
    logger.debug('Disconnected from the database');
  }
}

async function main() {
  await createNedbDatabase();
  await convertToSqlite();
}

// eslint-disable-next-line unicorn/prefer-top-level-await,promise/catch-or-return,promise/always-return
main().then(() => {
  logger.debug('App finished');
});
