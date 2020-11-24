'use strict';

const Sequelize = require('sequelize');
const path = require('path');
const config = require('../config');
const { getFilesInDirSync } = require('../utils');
const log = require('../log')('sequelize');

const sequelizeDefine = {
  freezeTableName: true,
  underscored: true,
  paranoid: true,
  timestamps: true
};

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  dialect: config.db.dialect,
  define: sequelizeDefine,
  logging: false,
  native: true
});

const sync = async _ => {
  const models = getFilesInDirSync(path.join(__dirname, '..', 'models'),
    '.js',
    ['index.js']);

  models.forEach(m => {
    require(m)(sequelize, Sequelize);
  });

  Object.keys(sequelize.models).forEach(m => {
    const model = sequelize.models[m];
    if (model.associate) model.associate(sequelize.models);
  });

  await sequelize.sync();
  log.info(`Sequelize synced ${models.length} models`);
};

const check = async _ => {
  try {
    const check = await sequelize.query('select version();');
    return !!check;
  } catch (err) {}
  return false;
};

module.exports = {
  sequelize: sequelize,
  sync: sync,
  check: check
};
