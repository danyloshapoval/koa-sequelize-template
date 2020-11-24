'use strict';

const logger = require('koa-logger');
const log = require('../log')('access');

module.exports = () => {
  return logger((_, args) => {
    log.info(args.slice(1).join(' '));
  });
};
