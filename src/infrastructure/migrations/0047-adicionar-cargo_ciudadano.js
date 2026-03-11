'use strict';

const tableName = 'planificacion_cargo';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.describeTable(tableName)
      .then(async tableDefinition => {
        if (!tableDefinition.ciudadano) {
          await queryInterface.addColumn(tableName, 'ciudadano', {
            type         : Sequelize.BOOLEAN,
            allowNull    : true,
            defaultvalue : false,
            field        : 'ciudadano'
          });
        }
      });
  }
};
