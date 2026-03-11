'use strict';

const util = require('../lib/util');
const lang = require('../lang');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    const columnName = 'permite_confidencial';

    const tableDescription = await queryInterface.describeTable('gestion_formulario');
    
    if (!tableDescription[columnName]) {
      await queryInterface.addColumn('gestion_formulario', columnName, {
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