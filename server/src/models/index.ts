import { Sequelize, Options } from 'sequelize';
import database from '@/configs/database';
import File from '@/models/file';

const config: Options = {
  username: database.username || '',
  password: database.password || '',
  database: database.database || '',
  host    : database.host || 'localhost',
  dialect : 'postgres',
  native  : false,
  logging : true,
  // port    : 5431,
  /* pool    : {
    maxUses: 1000,
  }, */
};

export const sequelize = new Sequelize(config);

const models = {
  File,
};

Object.keys(models).forEach((model) => {
  models[model].init(models[model].DataTypes, { ...models[model].initData, sequelize });
});

Object.keys(models).forEach((model) => {
  if (models[model].associate) {
    models[model].associate(models);
  }
  if (models[model].slugInit) {
    models[model].slugInit();
  }
});
