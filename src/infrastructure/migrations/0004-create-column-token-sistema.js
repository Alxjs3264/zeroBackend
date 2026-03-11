'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    const sql = `
      ALTER TABLE sys_auth ADD COLUMN IF NOT EXISTS token_sistema TEXT;
      ALTER TABLE gestion_documento ADD COLUMN IF NOT EXISTS compartido BOOLEAN;
      `;
    return queryInterface.sequelize.query(sql);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('');
  }
};
