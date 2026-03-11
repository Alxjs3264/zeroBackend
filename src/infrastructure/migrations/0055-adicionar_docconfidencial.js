'use strict';

const util = require('../lib/util');
const lang = require('../lang');

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const columnName = 'docconfidencial';

    const tableDescription = await queryInterface.describeTable('gestion_documento');
    
    if (!tableDescription[columnName]) {
      await queryInterface.addColumn('gestion_documento', columnName, {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        xlabel: columnName,
        field: columnName,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Deshacer los cambios en caso de un rollback
  }
};