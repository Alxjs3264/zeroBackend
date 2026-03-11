'use strict';
const { setTimestampsSeeder } = require('../lib/util');

const nuevosPermisos = [
  { id: '630fad53-a862-4d21-9f25-875f4bb1cfb9', tipo: 'SISTEMA', nombre: 'ver:flujos:avanzado', descripcion: 'Permiso para listar las reasignaciones', estado: 'ACTIVO', _user_created: '7171272e-b31b-4c34-9220-9f535c958c5c', _created_at: new Date() },
  { id: '9f898b81-127f-4db2-a3c3-fbb86956c854', tipo: 'SISTEMA', nombre: 'documento:generar:confidencial', descripcion: 'Permiso creacion de documentos confidenciales', estado: 'ACTIVO', _user_created: '7171272e-b31b-4c34-9220-9f535c958c5c', _created_at: new Date() },
  { id: '09c18805-19f8-49fa-a26a-908622928502', tipo: 'SISTEMA', nombre: 'flujo:generar:confidencial', descripcion: 'Permiso creacion de flujos confidenciales', estado: 'ACTIVO', _user_created: '7171272e-b31b-4c34-9220-9f535c958c5c', _created_at: new Date() },
  { id: 'c588e44b-2641-4b53-b0da-e915602d749c', tipo: 'SISTEMA', nombre: 'reporte:permanecer-oculto', descripcion: 'Permiso permite no aparecer en el listado de usuario de los reportes', estado: 'ACTIVO', _user_created: '7171272e-b31b-4c34-9220-9f535c958c5c', _created_at: new Date() },
  { id: '31950056-6762-40a9-b638-b597e5fd49be', tipo: 'SISTEMA', nombre: 'reporte:ver-usuario-oculto', descripcion: 'Permiso permite visualizar a los usuarios ocultos dentro los reportes', estado: 'ACTIVO', _user_created: '7171272e-b31b-4c34-9220-9f535c958c5c', _created_at: new Date() }
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableName = 'sys_permiso';
    for (const permiso of nuevosPermisos) {
      const [existingPermiso] = await queryInterface.sequelize.query(
            `SELECT * FROM ${tableName}
            WHERE (nombre = '${permiso.nombre}' OR id = '${permiso.id}') LIMIT 1;`,
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
