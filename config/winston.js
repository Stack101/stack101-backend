const appRoot = require('app-root-path');
const winston = require('winston');
require('winston-daily-rotate-file');
require('date-utils');

const myFormat = winston.format.printf(
  (info) => `${new Date().toFormat('YYYY-MM-DD HH24:MI:SS')} [${info.level.toUpperCase()}] - ${info.message}`,
);

const logger = winston.createLogger({
  level: 'debug',
  transports: [
    new winston.transports.DailyRotateFile({
      filename: `${appRoot}/logs/test.log`,
      handleExceptions: true,
      zippedArchive: false,
      format: myFormat,
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: myFormat,
      handleExceptions: true,
      colorize: true,
    }),
  );
}

module.exports = logger;
