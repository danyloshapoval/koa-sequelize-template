'use strict';

const log = require('../log')('error');

const isDevEnv = process.env.NODE_ENV === 'development';

const error = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (!err.handled) {
      ctx.status = 500;
      isDevEnv ? ctx.body = err.message : ctx.body = 'Oops';
    }

    if (err.logged || !err.handled || isDevEnv) log.error(err);
  }
};

module.exports = () => error;
