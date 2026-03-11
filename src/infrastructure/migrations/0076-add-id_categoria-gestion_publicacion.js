'use strict';

const util = require('../lib/util');
const lang = require('../lang');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableName = 'gestion_publicacion';
    const columnName = 'id_categoria';

    const tableDescription = await queryInterface.describeTable(tableName);

    if (!tableDescription[columnName]) {
      await queryInterface.addColumn(tableName, columnName, {
        type      : Sequelize.UUID,
        defaultValue: null,
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
