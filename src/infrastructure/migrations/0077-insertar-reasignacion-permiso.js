'use strict';
const uuid = require('uuid');

const permisos = [
  { id: uuid.v4(), tipo: 'SISTEMA', nombre: 'reasignaciones:listar', descripcion: 'Permiso para listar las reasignaciones', estado: 'ACTIVO', _user_created: '7171272e-b31b-4c34-9220-9f535c958c5c', _created_at: new Date() },
  { id: uuid.v4(), tipo: 'SISTEMA', nombre: 'reasignaciones:actualizar', descripcion: 'Permiso para gerrar las reasignaciones', estado: 'ACTIVO', _user_created: '7171272e-b31b-4c34-9220-9f535c958c5c', _created_at: new Date() }
];

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('sys_permiso', [
      ...permisos
    ], {})
      .then(async () => {
        queryInterface.bulkInsert('sys_rol_permiso', permisos.map(p => {
          return {
            id: uuid.v4(),
            id_rol: '88b0104c-1bd1-42b2-bb01-9bf0502bab5a',
            id_permiso: p.id,
            _user_created: '7171272e-b31b-4c34-9220-9f535c958c5c',
            _created_at: new Date()
          }
        }), {}).then(async () => {

        }).catch(error => {
          if (error.message.indexOf('already exists') > -1) return;
          console.error(error);
        // logger.error(error)
        });
      })
      .catch(error => {
        if (error.message.indexOf('already exists') > -1) return;
        console.error(error);
        // logger.error(error)
      });
  },
  down: function (queryInterface, Sequelize) {}
};
