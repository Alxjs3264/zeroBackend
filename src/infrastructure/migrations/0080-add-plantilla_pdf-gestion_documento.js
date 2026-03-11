'use strict';

const util = require('../lib/util');
const lang = require('../lang');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableName = 'gestion_documento';
    const columnName1 = 'plantilla_pdf';

    const tableDescription = await queryInterface.describeTable(tableName);

    if (!tableDescription[columnName1]) {
      await queryInterface.addColumn(tableName, columnName1, {
        type         : Sequelize.BOOLEAN,
        allowNull    : false,
        defaultValue : false,
        xlabel       : columnName1,
        field        : columnName1
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Deshacer los cambios en caso de un rollback
  }
};