'use strict';

const { dotEnv: env } = require('./src/utils');

env();
require('./src/app')();
