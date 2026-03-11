'use strict';

const util = require('../lib/util');
const lang = require('../lang');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    const columnName = 'docfisico';

    const tableDescription = await queryInterface.describeTable('bpm_solicitud_plantilla');
    
    if (!tableDescription[columnName]) {
      await queryInterface.addColumn('bpm_solicitud_plantilla', columnName, {
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