'use strict';

const {
  setTimestampsSeeder
} = require('../lib/util');

let items = [
  { id: 'd6e05072-cf56-4d86-b104-ff9eecfd3faa', tipo: 'SISTEMA', nombre: 'dashboard:noticias', descripcion: 'Ver las noticias en el dashboard', estado: 'ACTIVO' },
  { id: 'f16c9849-acb9-41e4-8c64-cd92c30cd17c', tipo: 'SISTEMA', nombre: 'dashboard:noticias-crear', descripcion: 'Crear las noticias en el dashboard', estado: 'ACTIVO' }
];

items = setTimestampsSeeder(items);

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('sys_permiso', items, {})
      .then(async () => {})
      .catch(error => {
        if (error.message.indexOf('already exists') > -1) return;
        console.error(error);
      });
  },

  down (queryInterface, Sequelize) {}
};
