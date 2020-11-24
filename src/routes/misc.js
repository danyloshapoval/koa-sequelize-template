'use strict';

const Router = require('koa-router');
const router = new Router({
  prefix: '/misc'
});

router.get('/env', ctx => {
  ctx.ok({ env: process.env.NODE_ENV });
});

module.exports = router;
