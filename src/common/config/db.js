'use strict';

const debug = require('debug')('app:db');

let db = {};
if (typeof process.env.NODE_ENV === 'string' && process.env.NODE_ENV === 'test') {
  db = {
    database: process.env.DB_NAME || 'zerodb',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 's3pd4v12023zero',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    timezone: 'America/La_Paz',
    logging: s => debug(s)
  };
} else {
  db = {
    database: process.env.DB_NAME || 'zerodb',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 's3pd4v12023zero',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    timezone: 'America/La_Paz',
    logging: s => debug(s)
  };
}

module.exports = db;
