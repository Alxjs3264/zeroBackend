'use strict';
const { setTimestampsSeeder } = require('../lib/util');

const nuevosParametros = [
  {
    id            : 'a4aaff33-11c8-4bc8-ada9-d9f24e708baf',
    grupo         : 'CONFIG-IOP',
    codigo        : 'IOP',
    otros         : null,
    nombre        : 'FIRMA REQUERIDA',
    descripcion   : 'FIRMAR PARA DERIVAR OBLIGATORIAMENTE',
    estado        : 'ACTIVO',
    _user_created : '7171272e-b31b-4c34-9220-9f535c958c5c',
    _user_updated : null,
    _user_deleted : null,
    _created_at   : '2024-04-30T08:47:37.843Z',
    _updated_at   : null,
    _deleted_at   : null
  }
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableName = 'sys_parametro';
    for (const parametro of nuevosParametros) {
      const [existingPermiso] = await queryInterface.sequelize.query(
            `SELECT * FROM ${tableName} WHERE grupo = '${parametro.grupo}' AND nombre = '${parametro.nombre}' LIMIT 1;`,
            { type: Sequelize.QueryTypes.SELECT }
      );
      // Si no existe, insertarlo
      if (!existingPermiso) {
        const valorInsertar = setTimestampsSeeder([parametro]);
        await queryInterface.bulkInsert(tableName, valorInsertar, {});
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Deshacer los cambios en caso de un rollback
  }
};
