// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-explicit-any */
import log4js, { getLogger, Logger as Log4jsLogger } from 'log4js';

export class Logger {
  private readonly logger: Log4jsLogger;

  constructor(tag: string) {
    this.logger = getLogger(tag);

    log4js.configure({
      appenders: {
        out: { type: 'stdout' },
        app: { type: 'file', filename: 'logs/app.log' },
      },
      categories: {
        default: {
          appenders: ['app', 'out'],
          level: 'debug',
        },
      },
    });
  }

  debug(message: any, ...optionalParameters: any[]): any {
    this.logger.debug(message, ...optionalParameters);
  }

  error(message: any, ...optionalParameters: any[]): any {
    this.logger.error(message, ...optionalParameters);
  }

  log(message: any, ...optionalParameters: any[]): any {
    this.logger.info(message, ...optionalParameters);
  }

  warn(message: any, ...optionalParameters: any[]): any {
    this.logger.warn(message, ...optionalParameters);
  }
}
