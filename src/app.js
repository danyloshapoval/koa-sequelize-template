'use strict';

const log = require('./log')('app');
const Koa = require('koa');
const config = require('./config');
const routes = require('./routes');
const { logger, error, response } = require('./middlewares');
const bodyParser = require('koa-bodyparser');
const { sequelize } = require('./loaders');
const cors = require('@koa/cors');
const env = process.env.NODE_ENV;

module.exports = async _ => {
  if (!process.env.NODE_ENV) {
    log.error('NODE_ENV not set');
    process.exit(1);
  }
  if (process.env.TZ !== 'UTC') {
    log.error('UTC time zone not set');
    process.exit(1);
  }
  process.on('uncaughtException', (err) => {
    log.error('Uncaught exception', err);
    process.exit(1);
  });
  process.on('unhandledRejection', (reason) => {
    log.error('Unhandled rejection', reason);
    process.exit(1);
  });

  await sequelize.sync();

  const app = new Koa();

  if (config.accessLogs) app.use(logger());

  app.use(cors({
    credentials: true
  }));

  app.use(error());
  app.use(response());
  app.use(bodyParser());
  app.use(routes());

  if (env !== 'development') {
    app.proxy = true;
  }

  if (env === 'production') {
    app.use(ctx => ctx.empty());
  } else {
    app.use(ctx => ctx.bad(404, 'Not found'));
  }

  const port = process.env.PORT ?? 8080;
  const host = process.env.HOST ?? '0.0.0.0';

  return app.listen(port, host, () => {
    log.info(`Server started ${host}:${port}`);
  });
};
