'use strict';

const { getFilesInDirSync } = require('../utils');
const config = require('../config');
const Router = require('koa-router');

const router = new Router({
  prefix: config.apiPath
});

getFilesInDirSync(__dirname, '.js', ['index.js'])
  .map(r => require(r))
  .forEach(r => router.use(r.routes()));

module.exports = () => router.routes();
