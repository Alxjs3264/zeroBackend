'use strict';

const { setTimestampsSeeder } = require('../lib/util');
const { Ids } = require('../../common/config/constants');

let items = [
  { id: Ids.roles['ROL SUPER ADMIN'], id_entidad: Ids.entidad['MINISTERIO DE JUSTICIA'], nombre: 'ROL SUPER ADMIN', descripcion: 'Rol administrador.', estado: 'ACTIVO' },
  { id: Ids.roles['iop'], id_entidad: Ids.entidad['MINISTERIO DE JUSTICIA'], nombre: 'iop', descripcion: 'Rol especial para registrar sistemas que pueden acceder a ciertos endpoints mediante un token api', estado: 'ACTIVO' },
  { id: Ids.roles.ministro, id_entidad: Ids.entidad['MINISTERIO DE JUSTICIA'], nombre: 'ministro', descripcion: 'Rol administrador.', estado: 'ACTIVO' },
  { id: Ids.roles.viceministro, id_entidad: Ids.entidad['MINISTERIO DE JUSTICIA'], nombre: 'viceministro', descripcion: 'Rol administrador.', estado: 'ACTIVO' },
  { id: Ids.roles.directores, id_entidad: Ids.entidad['MINISTERIO DE JUSTICIA'], nombre: 'director', descripcion: 'Rol administrador.', estado: 'ACTIVO' },
  { id: Ids.roles['jefes de unidad'], id_entidad: Ids.entidad['MINISTERIO DE JUSTICIA'], nombre: 'jefes de unidad', descripcion: 'Rol administrador.', estado: 'ACTIVO' },
  { id: Ids.roles.secretaria, id_entidad: Ids.entidad['MINISTERIO DE JUSTICIA'], nombre: 'secretaria', descripcion: 'Rol administrador.', estado: 'ACTIVO' },
  { id: Ids.roles.autoridades, id_entidad: Ids.entidad['MINISTERIO DE JUSTICIA'], nombre: 'autoridades', descripcion: 'Rol administrador.', estado: 'ACTIVO' },
  { id: Ids.roles['personal mjti'], id_entidad: Ids.entidad['MINISTERIO DE JUSTICIA'], nombre: 'personal mjti', descripcion: 'Rol administrador.', estado: 'ACTIVO' },
  { id: 'f7d08f21-49ad-41e7-8b4c-845e5452a6d4', id_entidad: Ids.entidad['MINISTERIO DE JUSTICIA'], nombre: 'personal planificacion', descripcion: 'Rol planificación', estado: 'ACTIVO' },
  { id: 'bdabff4a-b40e-43df-9ba0-b2696dbf6afb', id_entidad: Ids.entidad['MINISTERIO DE JUSTICIA'], nombre: 'personal contratacion', descripcion: 'Rol contratación', estado: 'ACTIVO' }
];

// Asignando datos de log y timestamps a los datos
items = setTimestampsSeeder(items);

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('sys_rol', items, {})
      .then(async () => {})
      .catch(error => {
        if (error.message.indexOf('already exists') > -1) return;
        console.error(error);
        // logger.error(error)
      });
  },

  down (queryInterface, Sequelize) { }
};
