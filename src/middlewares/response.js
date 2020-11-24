'use strict';

const empty = (ctx) => {
  ctx.body = '';
  ctx.status = 200;
};

const ok = (ctx, json) => {
  let ok = { success: true };
  if (json) ok = { ...ok, ...json };
  ctx.body = ok;
  ctx.status = 200;
};

const test = (ctx, value, statusCode, error, { logged = false, code = 0 } = {}) => {
  if (!value) ctx.bad(statusCode, error, { logged: logged, code: code });
};

const bad = (ctx, statusCode, error, { logged = false, code = 0 } = {}) => {
  const e = {
    success: false,
    error: {
      code: code,
      message: error instanceof Error ? error.message : error
    }
  };
  ctx.body = e;
  ctx.status = statusCode || 400;
  let err;
  if (typeof error === 'string') {
    err = new Error(error);
  } else if (error instanceof Error) {
    err = error;
  } else {
    err = new Error(JSON.stringify(error));
  }
  err.handled = true;
  err.logged = logged;
  throw err;
};

const set = (ctx, next) => {
  ctx.ok = ok.bind(ctx, ctx);
  ctx.bad = bad.bind(ctx, ctx);
  ctx.test = test.bind(ctx, ctx);
  ctx.empty = empty.bind(ctx, ctx);
  return next();
};

module.exports = () => set;
