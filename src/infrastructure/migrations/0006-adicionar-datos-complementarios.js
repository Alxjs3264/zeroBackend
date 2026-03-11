'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    const sql = `
       ALTER TABLE gestion_flujo_derivacion ADD COLUMN IF NOT EXISTS informacion_complementaria JSONB DEFAULT NULL;
    `;
    return queryInterface.sequelize.query(sql);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('');
  }
};
