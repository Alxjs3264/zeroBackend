'use strict';

const tableName = 'bpm_solicitud_plantilla';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.describeTable(tableName)
      .then(async tableDefinition => {
        if (!tableDefinition.instancias) {
          await queryInterface.addColumn(tableName, 'instancias', {
            type         : Sequelize.INTEGER,
            defaultValue : 999,
            field        : 'instancias'
          });
        }
      });
  }
};
