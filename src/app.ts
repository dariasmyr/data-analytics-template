import channelsJson from '../data/twitch-channels-template.json';
import { SqliteConverterService } from './sqlite-converter-service/sqlite-converter-service';

async function main() {
  async function convertToSqlite() {
    const sqliteConverterService = new SqliteConverterService();

    try {
      await sqliteConverterService.convertToSqlite(channelsJson);
      await sqliteConverterService.prisma.$disconnect();
    } catch (error) {
      console.error(error);
      await sqliteConverterService.prisma.$disconnect();
      console.error('!!!!!!!!!!!!!!!Error!!!!!!!!!!!!!!!');
    }
  }
  await convertToSqlite();
  console.log('---------------------------------');
  console.log('SqliteConverterService DONE!');
}

// eslint-disable-next-line unicorn/prefer-top-level-await,promise/catch-or-return
main().then(() => console.log('DONE!'));
