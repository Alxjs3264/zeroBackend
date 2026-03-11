'use strict';

const tableName = 'bpm_servicio';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.describeTable(tableName)
      .then(async tableDefinition => {
        if (!tableDefinition.tipo) {
          await queryInterface.addColumn(tableName, 'tipo', {
            type         : Sequelize.STRING(50),
            allowNull    : true,
            defaultvalue : 'CONSUMIR SERVICIO',
            field        : 'tipo'
          });
        }
      });
  }
};
