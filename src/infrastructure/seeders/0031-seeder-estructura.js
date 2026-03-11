'use strict';

const { setTimestampsSeeder } = require('../lib/util');
const { saltRounds } = require('../../common/config/auth');
const { Ids } = require('../../common/config/constants');
const bcrypt = require('bcrypt');

// Datos de producción
let items = [
  {
    id                  : '5e73a864-db39-4414-8d06-52f97d9d0001',
    id_estructura_padre : '5e73a864-db39-4414-8d06-52f97d9d0001',
    nombre              : 'Servicios Personales',
    nivel               : 50,
    sigla               : 'SIGLA',
    nombre_indicador    : 'indicador',
    estado              : 'ACTIVO'
  }
];

items = setTimestampsSeeder(items);

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('planificacion_estructura', items, {})
      .then(async () => {})
      .catch(error => {
        if (error.message.indexOf('already exists') > -1) return;
        console.error(error);
      });
  },
  down (queryInterface, Sequelize) {}
};
