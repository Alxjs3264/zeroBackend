'use strict';

const { setTimestampsSeeder } = require('../lib/util');
const { saltRounds } = require('../../common/config/auth');
const { Ids } = require('../../common/config/constants');
const bcrypt = require('bcrypt');

// Datos de producción
let items = [
  {
    id                                : '5e73a864-db39-4414-8d06-52f97d9d0001',
    id_unidad_organizacional          : '4c18ed6a-d392-401a-902f-dbececeb890c',
    id_estructura                     : '5e73a864-db39-4414-8d06-52f97d9d0001',
    id_tipo_formulacion               : '5e73a864-db39-4414-8d06-52f97d9d0001',
    id_unidad_organizacional_revisora : '40015ca7-c5af-474b-ac61-f4111e16cf64',
    id_usuario_revisor                : 'aa820d24-61aa-42a7-8da0-b21e2f4dfef8',
    id_usuario_validador              : 'ed32cfa3-052d-4dda-8693-c9c20d43e1a4',
    validado                          : true,
    fecha_revision                    : '2021-08-15',
    fecha_validacion                  : '2021-08-15'
  }
];

items = setTimestampsSeeder(items);

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('planificacion_formulacion', items, {})
      .then(async () => {})
      .catch(error => {
        if (error.message.indexOf('already exists') > -1) return;
        console.error(error);
      });
  },
  down (queryInterface, Sequelize) {}
};
