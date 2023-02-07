import log4js from 'log4js';

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

const logger = log4js.getLogger();

export default logger;
