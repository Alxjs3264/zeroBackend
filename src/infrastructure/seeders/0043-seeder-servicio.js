'use strict';

const { setTimestampsSeeder } = require('../lib/util');
const { constants } = require('../../common/config');
const config = require('../../common/config')

// Datos de producción
let items = [
  {
    id            : 'b6484874-e788-4344-9b94-d1495753aa91',
    nombre: 'Serivio local',
    descripcion: 'Servicio de prueba para probar interoperabilidad',
    url_base: 'http://localhost:3000/',
    url_servicio: 'public/status',
    url_status: 'public/status',
    metodo: 'GET',
    token: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTYwNzA1NDAsImlkUm9sIjoxMDAwfQ.ExKzELNpEYq_sszLyRmCNcN3wAcC0a_yFhfsxVFAIuU ',
    estado: 'ACTIVO',
  },
  {
    id: 'b6484874-e788-4344-9b94-d1495753aa92',
    nombre: 'Servicio Reversion SIPFA',
    descripcion: 'Servicio de reversión para el presupuesto SIPFA',
    url_base: `${config.app.sipfaUrl}`,
    url_servicio: 'Presupuesto/@id',
    url_status: 'funcionario',
    metodo: 'DELETE',
    estado: 'ACTIVO',
  }
];

items = setTimestampsSeeder(items);

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('bpm_servicio', items, {})
      .then(async () => {})
      .catch(error => {
        if (error.message.indexOf('already exists') > -1) return;
        console.error(error);
      });
  },
  down (queryInterface, Sequelize) {}
};
