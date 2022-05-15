import winston from 'winston';
import util from 'util';

import config from '~/config';

const {
  combine,
  timestamp,
  errors,
  printf,
  colorize,
  json,
} = winston.format;

// console transport print format
const printFormat = printf(({
  level, message, timestamp: time, ...args
}) => {
  const stack = Array.isArray(args.stack) ? args.stack.join('\n') : args.stack;

  return `${time} ${level}: ${message} ${stack ? `\n${stack}` : ''}`;
});

// format option
const opts = {
  console: combine(
    errors({ stack: true }),
    colorize({ level: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    printFormat,
  ),
  json: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    json(),
  ),
};

const logger = winston.createLogger({
  level: config.debug ? 'debug' : 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({ format: opts.console }),
    new winston.transports.File({ format: opts.json, filename: 'logs/combined.log' }),
    new winston.transports.File({ format: opts.json, filename: 'logs/error.log', level: 'error' }),
  ],
});

function inspect (message: any) {
  return typeof message === 'string' ? message : util.inspect(message, { showHidden: false, depth: null, colors: false });
}

global.console.info = function info (...args) {
  const messages = args.map((message) => inspect(message));

  return logger.info(util.format(...messages));
};

global.console.log = function log (...args) {
  const messages = args.map((message) => inspect(message));

  return logger.info(util.format(...messages));
};

global.console.error = function error (...args) {
  const messages = args.map((message) => inspect(message));

  return logger.error(util.format(...messages));
};

global.console.warn = function warn (...args) {
  const messages = args.map((message) => inspect(message));

  return logger.warn(util.format(...messages));
};

(global.console as any).silly = function silly (...args: any[]) {
  const messages = args.map((message) => inspect(message));

  return logger.silly(util.format(...messages));
};

global.console.debug = function debug (...args) {
  const messages = args.map((message) => inspect(message));

  return logger.debug(util.format(...messages));
};

(global.console as any).verbose = function verbose (...args: any[]) {
  const messages = args.map((message) => inspect(message));

  return logger.verbose(util.format(...messages));
};

export default {
  log (...args: any[]) {
    const messages = args.map((message) => inspect(message));

    return logger.info(util.format(...messages));
  },

  info (...args: any[]) {
    const messages = args.map((message) => inspect(message));

    return logger.info(util.format(...messages));
  },

  warn (...args: any[]) {
    const messages = args.map((message) => inspect(message));

    return logger.warn(util.format(...messages));
  },

  error (...args: any[]) {
    const messages = args.map((message) => inspect(message));

    return logger.error(util.format(...messages));
  },

  silly (...args: any[]) {
    const messages = args.map((message) => inspect(message));

    return logger.silly(util.format(...messages));
  },

  debug (...args: any[]) {
    const messages = args.map((message) => inspect(message));

    return logger.debug(util.format(...messages));
  },

  verbose (...args: any[]) {
    const messages = args.map((message) => inspect(message));

    return logger.verbose(util.format(...messages));
  },

  clear () {
    console.clear();
  },
};