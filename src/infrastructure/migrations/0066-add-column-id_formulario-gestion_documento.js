'use strict';

module.exports = {
  up: async function (queryInterface, Sequelize) {
    const tableName = 'gestion_documento';
    const columnName = 'id_formulario';

    const tableDescription = await queryInterface.describeTable(tableName);
    const sql = `
    ALTER TABLE gestion_documento  ADD COLUMN ${columnName} UUID GENERATED ALWAYS AS ((plantilla->>'id')::uuid) STORED;
  `;
    if (!tableDescription[columnName]) {
      return queryInterface.sequelize.query(sql);
    }
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('');
  }
};
