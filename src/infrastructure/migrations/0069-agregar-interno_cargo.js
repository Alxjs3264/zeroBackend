'use strict';

const util = require('../lib/util');
const lang = require('../lang');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableName = 'planificacion_cargo';
    const columnName = 'interno';

    const tableDescription = await queryInterface.describeTable(tableName);

    if (!tableDescription[columnName]) {
      await queryInterface.addColumn(tableName, columnName, {
        type      : Sequelize.INTEGER,
        allowNull : true,
        xlabel    : columnName,
        field     : columnName
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Deshacer los cambios en caso de un rollback
  }
};
