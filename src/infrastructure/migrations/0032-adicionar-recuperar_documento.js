'use strict';

const tableName = 'bpm_paso';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.describeTable(tableName)
      .then(async tableDefinition => {
        if (!tableDefinition.recuperar_documento) {
          await queryInterface.addColumn(tableName, 'recuperar_documento', {
            type         : Sequelize.BOOLEAN,
            allowNull    : false,
            defaultValue : false,
            field        : 'recuperar_documento'
          });
        }
      });
  }
};
