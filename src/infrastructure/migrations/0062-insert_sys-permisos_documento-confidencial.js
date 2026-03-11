'use strict';
const { setTimestampsSeeder } = require('../lib/util');

const nuevosPermisos = [
  {
		id: '2f174667-8866-409d-99f8-2c0c348f889c',
		nombre: 'ver:documento:confidencial',
		descripcion: 'Permiso para ver documentos confidenciales',
		tipo: 'SISTEMA',
		estado: 'ACTIVO',
		_user_created: '7171272e-b31b-4c34-9220-9f535c958c5c',
		_user_updated: null,
		_user_deleted: null,
		_created_at: '2024-05-09T18:03:00.750Z',
		_updated_at: '2024-05-09T18:03:00.750Z',
		_deleted_at: null,
		id_menu: null
	},
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableName = 'sys_permiso';
    for (const permiso of nuevosPermisos) {
      const [existingPermiso] = await queryInterface.sequelize.query(
            `SELECT * FROM ${tableName} WHERE id = '${permiso.id}' LIMIT 1;`,
            { type: Sequelize.QueryTypes.SELECT }
      );
      // Si no existe, insertarlo
      if (!existingPermiso) {
        const valorInsertar = setTimestampsSeeder([permiso]);
        await queryInterface.bulkInsert(tableName, valorInsertar, {});
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Deshacer los cambios en caso de un rollback
  }
};
