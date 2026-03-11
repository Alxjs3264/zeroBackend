'use strict';
const { setTimestampsSeeder } = require('../lib/util');

const nuevosParametros = [
  {
    id            : '8af838d1-b520-46e8-ac5b-0dfce89209bf',
    grupo         : 'TIPO_PUBLICACION',
    codigo        : 'TPREG',
    otros         : null,
    nombre        : 'REGLAMENTO',
    descripcion   : 'REGLAMENTO',
    estado        : 'ACTIVO',
    _user_created : '7171272e-b31b-4c34-9220-9f535c958c5c',
    _created_at   : '2024-04-30T08:47:37.843Z'
  },
  {
    id            : '6c65022a-bccb-4900-983d-19dc725e5de7',
    grupo         : 'TIPO_PUBLICACION',
    codigo        : 'TPINST',
    otros         : null,
    nombre        : 'INSTRUCTIVO',
    descripcion   : 'INSTRUCTIVO',
    estado        : 'ACTIVO',
    _user_created : '7171272e-b31b-4c34-9220-9f535c958c5c',
    _created_at   : '2024-04-30T08:47:37.843Z'
  },
  {
    id            : 'ef25c27f-892d-4427-882e-63d8f9fd08be',
    grupo         : 'TIPO_PUBLICACION',
    codigo        : 'TPCOM',
    otros         : null,
    nombre        : 'COMUNICADO',
    descripcion   : 'COMUNICADO',
    estado        : 'ACTIVO',
    _user_created : '7171272e-b31b-4c34-9220-9f535c958c5c',
    _created_at   : '2024-04-30T08:47:37.843Z'
  },
  {
    id            : '2dd662f7-4df6-4cf0-8650-9466a96604fb',
    grupo         : 'TIPO_PUBLICACION',
    codigo        : 'TPINT',
    otros         : null,
    nombre        : 'INTERINATOS',
    descripcion   : 'INTERINATOS',
    estado        : 'ACTIVO',
    _user_created : '7171272e-b31b-4c34-9220-9f535c958c5c',
    _created_at   : '2024-04-30T08:47:37.843Z'
  },
  {
    id            : '2162ef22-ecee-4b1e-8e49-a27b912e0dac',
    grupo         : 'TIPO_PUBLICACION',
    codigo        : 'TPINCO',
    otros         : null,
    nombre        : 'INCORPORACIONES',
    descripcion   : 'INCORPORACIONES',
    estado        : 'ACTIVO',
    _user_created : '7171272e-b31b-4c34-9220-9f535c958c5c',
    _created_at   : '2024-04-30T08:47:37.843Z'
  },
  {
    id            : '11ef33cc-0d3a-4cb4-9f22-0603890cc5c5',
    grupo         : 'TIPO_PUBLICACION',
    codigo        : 'TPCIR',
    otros         : null,
    nombre        : 'CIRCULAR',
    descripcion   : 'CIRCULAR',
    estado        : 'ACTIVO',
    _user_created : '7171272e-b31b-4c34-9220-9f535c958c5c',
    _created_at   : '2024-04-30T08:47:37.843Z'
  },
  {
    id            : 'c1ee1f32-148d-4171-9d94-286576ac2b50',
    grupo         : 'TIPO_PUBLICACION',
    codigo        : 'TPCONV',
    otros         : null,
    nombre        : 'CONVOCATORIAS',
    descripcion   : 'CONVOCATORIAS',
    estado        : 'ACTIVO',
    _user_created : '7171272e-b31b-4c34-9220-9f535c958c5c',
    _created_at   : '2024-04-30T08:47:37.843Z'
  },
  {
    id            : '5e5de3f2-9dae-442e-8ebc-1384c36f0df7',
    grupo         : 'TIPO_PUBLICACION',
    codigo        : 'TPCUR',
    otros         : null,
    nombre        : 'CURSOS',
    descripcion   : 'CURSOS',
    estado        : 'ACTIVO',
    _user_created : '7171272e-b31b-4c34-9220-9f535c958c5c',
    _created_at   : '2024-04-30T08:47:37.843Z'
  },
  {
    id            : 'd309fa5a-731e-43d9-a236-af228b049118',
    grupo         : 'TIPO_PUBLICACION',
    codigo        : 'TPCAP',
    otros         : null,
    nombre        : 'CAPACITCACIONES',
    descripcion   : 'CAPACITCACIONES',
    estado        : 'ACTIVO',
    _user_created : '7171272e-b31b-4c34-9220-9f535c958c5c',
    _created_at   : '2024-04-30T08:47:37.843Z'
  },
  {
    id            : '61ea4175-9a58-40b1-b696-fee39a8fa3fd',
    grupo         : 'TIPO_PUBLICACION',
    codigo        : 'TPOT',
    otros         : null,
    nombre        : 'OTROS',
    descripcion   : 'OTROS',
    estado        : 'ACTIVO',
    _user_created : '7171272e-b31b-4c34-9220-9f535c958c5c',
    _created_at   : '2024-04-30T08:47:37.843Z'
  }
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableName = 'sys_parametro';
    for (const parametro of nuevosParametros) {
      const [existingPermiso] = await queryInterface.sequelize.query(
            `SELECT * FROM ${tableName}
            WHERE grupo = '${parametro.grupo}' AND (nombre = '${parametro.nombre}' OR id = '${parametro.id}') LIMIT 1;`,
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
