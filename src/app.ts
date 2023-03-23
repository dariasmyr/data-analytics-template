import { Logger } from './logger/logger';

const logger = new Logger('App');

function main() {
  logger.debug('Starting the application');
}

main();
