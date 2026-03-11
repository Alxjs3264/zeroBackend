'use strict';

const util = require('../lib/util');
const lang = require('../lang');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableName = 'gestion_documento';
    const columnName1 = 'remitenteDe';
    const columnName2 = 'destinatarioArea';
    const columnName3 = 'destinatarioEspecifico';

    const tableDescription = await queryInterface.describeTable(tableName);

    if (!tableDescription[columnName1]) {
      await queryInterface.addColumn(tableName, columnName1, {
        type      : Sequelize.UUID,
        allowNull : true,
        xlabel    : columnName1,
        field     : columnName1
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

    if (!tableDescription[columnName3]) {
      await queryInterface.addColumn(tableName, columnName3, {
        type      : Sequelize.UUID,
        allowNull : true,
        xlabel    : columnName3,
        field     : columnName3
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Deshacer los cambios en caso de un rollback
  }
};
