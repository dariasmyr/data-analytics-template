import { Logger } from './logger/logger';

const logger = new Logger('App');

function main(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _arguments: string[],
) {
  logger.debug('Starting the application');
}

main(process.argv);
