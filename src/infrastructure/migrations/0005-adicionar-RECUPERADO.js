'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    const sql = `
      ALTER TYPE enum_gestion_flujo_derivacion_tipo ADD VALUE IF NOT EXISTS 'RECUPERADO';
      ALTER TABLE gestion_formulario ADD COLUMN IF NOT EXISTS doble_verificacion BOOLEAN DEFAULT FALSE;
    `;
    return queryInterface.sequelize.query(sql);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('');
  }
};
