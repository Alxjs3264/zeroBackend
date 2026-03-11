'use strict';

const {
  setTimestampsSeeder
} = require('../lib/util');

// Datos de producción
let items = [
  { id: '6190597f-7fa6-4c39-bcc9-7a1441ba566a', nombre: 'Dashboard', ruta: 'dashboard', icono: 'dashboard', orden: 1, id_menu: null, estado: 'ACTIVO'  },
  { id: '6190597f-7fa6-4c39-bcc9-7a1441ba5667', nombre: 'Bandeja', ruta: 'bandeja', icono: 'inbox', orden: 2, id_menu: null, estado: 'ACTIVO'  },
  { id: '039a897a-76dd-44c1-b3d7-9682df8f5342', nombre: 'Entidades', ruta: 'entidades', icono: 'business', orden: 3, id_menu: null, estado: 'ACTIVO'  },
  { id: '61d6d53b-ac65-41ac-bc54-3228f548f40a', nombre: 'Roles', ruta: 'roles', icono: 'group', orden: 4, id_menu: null, estado: 'ACTIVO'  },
  { id: 'ef6b99d0-0834-4d1e-86b0-207111744f98', nombre: 'Menus', ruta: 'menus', icono: 'menu', orden: 5, id_menu: null, estado: 'ACTIVO'  },
  { id: '6dc27435-bb49-48c8-b98d-ed9024d10ec5', nombre: 'Usuarios', ruta: 'usuarios', icono: 'people', orden: 6, id_menu: null, estado: 'ACTIVO'  },
  { id: '6190597f-7fa6-4c39-bcc9-7a1441ba5612', nombre: 'Cargo', ruta: 'cargos', icono: 'work', orden: 7, id_menu: null, estado: 'ACTIVO'  },
  { id: 'a0882ff9-0d95-4d60-835d-85624f7a3469', nombre: 'Parametros', ruta: 'parametros', icono: 'settings', orden: 7, id_menu: null, estado: 'ACTIVO'  },
  { id: 'cc522099-0d95-8149-3fed-a2626f7e3461', nombre: 'Formularios', ruta: 'formulario', icono: 'backup_table', orden: 8, id_menu: null, estado: 'ACTIVO'  },
  { id: '22c3f8db-8414-49e3-87bf-455d326170b2', nombre: 'Flujos', ruta: 'flujos', icono: 'account_tree', orden: 9, id_menu: null, estado: 'ACTIVO'  },
  { id: '7914cf8c-39b2-4561-ac2e-3cef07d8925e', nombre: 'Servicios', ruta: 'servicios', icono: 'cloud_done', orden: 10, id_menu: null, estado: 'ACTIVO'  },
  { id: '6190597f-7fa6-4c39-bcc9-7a1441ba566f', nombre: 'Reporte Libro', ruta: 'reporte/libro', icono: 'menu_book', orden: 11, id_menu: null, estado: 'ACTIVO'  },
  { id: '6190597f-7fa6-4c39-bcc9-7a1441ba5664', nombre: 'Super buscador', ruta: 'super-buscador', icono: 'search', orden: 12, id_menu: null, estado: 'ACTIVO'  }
];

items = setTimestampsSeeder(items);

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('sys_menu', items, {})
      .then(async () => {})
      .catch(error => {
        if (error.message.indexOf('already exists') > -1) return;
        console.error(error);
      });
  },

  down (queryInterface, Sequelize) {}
};
