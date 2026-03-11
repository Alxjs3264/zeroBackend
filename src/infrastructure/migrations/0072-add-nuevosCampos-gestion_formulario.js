'use strict';

const util = require('../lib/util');
const lang = require('../lang');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableName = 'gestion_formulario';
    const columnName = [
      'mostrar_fondo_pdf',
      'fecha_literal_pdf',
      'formato_cite_pdf'
    ];

    const tableDescription = await queryInterface.describeTable(tableName);

    if (!tableDescription[columnName[0]]) {
      await queryInterface.addColumn(tableName, columnName[0], {
        type         : Sequelize.BOOLEAN,
        allowNull    : false,
        defaultValue : false,
        xlabel       : columnName[0],
        field        : columnName[0]
      });
    }

    if (!tableDescription[columnName[1]]) {
      await queryInterface.addColumn(tableName, columnName[1], {
        type         : Sequelize.BOOLEAN,
        allowNull    : false,
        defaultValue : false,
        xlabel       : columnName[1],
        field        : columnName[1]
      });
    }

    if (!tableDescription[columnName[2]]) {
      await queryInterface.addColumn(tableName, columnName[2], {
        type         : Sequelize.STRING(200),
        allowNull    : true,
        defaultValue : null,
        xlabel       : columnName[2],
        field        : columnName[2]
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Deshacer los cambios en caso de un rollback
  }
};
