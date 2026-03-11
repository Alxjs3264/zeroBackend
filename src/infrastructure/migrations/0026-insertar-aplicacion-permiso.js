'use strict';
const uuid = require('uuid');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('sys_permiso', [
      { id: '512cd62d-d48f-4be9-ba90-5181f2fbbf55', tipo: 'SISTEMA', nombre: 'aplicaciones:crear', descripcion: 'Permiso para listar planificacions', estado: 'ACTIVO', _user_created: '7171272e-b31b-4c34-9220-9f535c958c5c', _created_at: new Date() },
      { id: '512cd62d-d48f-4be9-ba90-5181f2fbbf54', tipo: 'SISTEMA', nombre: 'aplicaciones:listar', descripcion: 'Permiso para listar planificacions', estado: 'ACTIVO', _user_created: '7171272e-b31b-4c34-9220-9f535c958c5c', _created_at: new Date() },
      { id: '512cd62d-d48f-4be9-ba90-5181f2fbbf56', tipo: 'SISTEMA', nombre: 'aplicaciones:actualizar', descripcion: 'Permiso para listar planificacions', estado: 'ACTIVO', _user_created: '7171272e-b31b-4c34-9220-9f535c958c5c', _created_at: new Date() },
      { id: '512cd62d-d48f-4be9-ba90-5181f2fbbf57', tipo: 'SISTEMA', nombre: 'aplicaciones:eliminar', descripcion: 'Permiso para listar planificacions', estado: 'ACTIVO', _user_created: '7171272e-b31b-4c34-9220-9f535c958c5c', _created_at: new Date() }
    ], {})
      .then(async () => {
        queryInterface.bulkInsert('sys_rol_permiso', [
          { id: uuid.v4(), id_rol: '88b0104c-1bd1-42b2-bb01-9bf0502bab5a', id_permiso: '512cd62d-d48f-4be9-ba90-5181f2fbbf55', _user_created: '7171272e-b31b-4c34-9220-9f535c958c5c', _created_at: new Date() },
          { id: uuid.v4(), id_rol: '88b0104c-1bd1-42b2-bb01-9bf0502bab5a', id_permiso: '512cd62d-d48f-4be9-ba90-5181f2fbbf54', _user_created: '7171272e-b31b-4c34-9220-9f535c958c5c', _created_at: new Date() },
          { id: uuid.v4(), id_rol: '88b0104c-1bd1-42b2-bb01-9bf0502bab5a', id_permiso: '512cd62d-d48f-4be9-ba90-5181f2fbbf56', _user_created: '7171272e-b31b-4c34-9220-9f535c958c5c', _created_at: new Date() },
          { id: uuid.v4(), id_rol: '88b0104c-1bd1-42b2-bb01-9bf0502bab5a', id_permiso: '512cd62d-d48f-4be9-ba90-5181f2fbbf57', _user_created: '7171272e-b31b-4c34-9220-9f535c958c5c', _created_at: new Date() }

        ], {}).then(async () => {

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
