'use strict';

const { setTimestampsSeeder } = require('../lib/util');

// Datos de producción
let items = [
  {
    id          : 'dc5aad94-bd51-4428-b75a-4c95e5790b11',
    fuente      : '10',
    sigla       : 'TGN',
    organismo   : '111',
    codigo      : 'TGN - 10',
    descripcion : 'TESORO GENERAL DE LA NACION - TESOROGENERAL DE LA NACION'
  },
  {
    id          : 'dc5aad94-bd51-4428-b75a-4c95e5790b12',
    fuente      : '11',
    sigla       : 'TGN-O',
    organismo   : '0',
    codigo      : 'TGN - 11',
    descripcion : 'TESORO GENERAL DE LA NACION - '
  },
  {
    id          : 'dc5aad94-bd51-4428-b75a-4c95e5790b13',
    fuente      : '42',
    sigla       : 'TRE',
    organismo   : '230',
    codigo      : 'TRE - 42',
    descripcion : 'TRANSAFERENCIA DE RECURSOS ESPECIFICOS - OTROS RECURSOS'
  },
  {
    id          : 'dc5aad94-bd51-4428-b75a-4c95e5790b14',
    fuente      : '80',
    sigla       : 'DON',
    organismo   : '528',
    codigo      : 'DON - 80',
    descripcion : 'DONACION EXTERNA'
  }
];

items = setTimestampsSeeder(items);

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('presupuesto_organismo_financiador', items, {})
      .then(async () => {})
      .catch(error => {
        if (error.message.indexOf('already exists') > -1) return;
        console.error(error);
      });
  },
  down (queryInterface, Sequelize) {}
};
