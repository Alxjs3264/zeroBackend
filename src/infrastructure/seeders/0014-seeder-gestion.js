'use strict';

const { setTimestampsSeeder } = require('../lib/util');

// Datos de producción
let items = [
  {
    id                         : '743482c5-0918-463d-a5f5-6a62f436dce5',
    // id_estructura              : '5ad115c6-fe6a-4d41-b401-c06339829611',
    descripcion                : '2021',
    programacion_habilitada    : true,
    fecha_inicio_programacion  : '2021-08-15',
    fecha_fin_programacion     : '2021-08-15',
    id_monitoreo               : 'a129e589-eaad-4d8b-b413-8eefafe7e4c8',
    fecha_inicio_monitoreo     : '2021-08-15',
    fecha_fin_monitoreo        : '2021-08-15',
    id_evaluacion              : '06f5e7a2-8ee9-4d2f-beaa-b0bfc0e4f4a6',
    fecha_inicio_evaluacion    : '2021-08-15',
    fecha_fin_evaluacion       : '2021-08-15',
    reformulacion_habilitada   : true,
    fecha_inicio_reformulacion : '2021-08-15',
    fecha_fin_reformulacion    : '2021-08-15'
  },
  {
    id                         : 'c64a96a2-3d4c-4b5c-9749-d2c51323a374',
    // id_estructura              : '5ad115c6-fe6a-4d41-b401-c06339829611',
    descripcion                : '2022',
    programacion_habilitada    : true,
    fecha_inicio_programacion  : '2021-08-15',
    fecha_fin_programacion     : '2021-08-15',
    id_monitoreo               : 'a129e589-eaad-4d8b-b413-8eefafe7e4c8',
    fecha_inicio_monitoreo     : '2021-08-15',
    fecha_fin_monitoreo        : '2021-08-15',
    id_evaluacion              : '06f5e7a2-8ee9-4d2f-beaa-b0bfc0e4f4a6',
    fecha_inicio_evaluacion    : '2021-08-15',
    fecha_fin_evaluacion       : '2021-08-15',
    reformulacion_habilitada   : true,
    fecha_inicio_reformulacion : '2021-08-15',
    fecha_fin_reformulacion    : '2021-08-15'
  }
];

items = setTimestampsSeeder(items);

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('planificacion_gestion', items, {})
      .then(async () => {})
      .catch(error => {
        if (error.message.indexOf('already exists') > -1) return;
        console.error(error);
      });
  },
  down (queryInterface, Sequelize) {}
};
