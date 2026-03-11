'use strict';

const util = require('../lib/util');
const lang = require('../lang');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableName = 'gestion_formulario';
    const columnName1 = 'permite_cite_diferente';
    const columnName2 = 'id_area_cite';

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

    if (!tableDescription[columnName2]) {
      await queryInterface.addColumn(tableName, columnName2, {
        type      : Sequelize.UUID,
        allowNull : true,
        xlabel    : columnName2,
        field     : columnName2
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Deshacer los cambios en caso de un rollback
  }
};
