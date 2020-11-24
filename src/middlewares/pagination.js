'use strict';

const pagination = async (ctx, next) => {
  const limit = parseInt(ctx.query.limit) || 1;
  const offset = parseInt(ctx.query.offset) || 0;
  ctx.pagination = {
    limit: limit,
    offset: offset
  };
  return next();
};

module.exports = _ => pagination;
