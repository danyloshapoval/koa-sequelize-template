'use strict';

const log4js = require('log4js');

module.exports = (tag, level) => {
  const logger = log4js.getLogger(tag);
  logger.level = level || 'debug';
  return logger;
};
