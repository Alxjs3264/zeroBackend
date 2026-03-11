'use strict';

const util = require('../lib/util');
const lang = require('../lang');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const enumName = 'enum_gestion_flujo_derivacion_tipo';
    const newValue = 'RECHAZADO';

    // Verifica si el valor ya existe en el ENUM
    const [[result]] = await queryInterface.sequelize.query(`
      SELECT 1 
      FROM pg_type t
      JOIN pg_enum e ON t.oid = e.enumtypid
      WHERE t.typname = '${enumName}' AND e.enumlabel = '${newValue}';
    `);

    if (!result) {
      await queryInterface.sequelize.query(`
        ALTER TYPE "${enumName}" ADD VALUE '${newValue}';
      `);
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Deshacer los cambios en caso de un rollback
  }
};

