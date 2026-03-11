'use strict';

const tableName = 'gestion_formulario';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.describeTable(tableName)
      .then(async tableDefinition => {
        if (!tableDefinition.migracion_dori) {
          await queryInterface.addColumn(tableName, 'migracion_dori', {
            type         : Sequelize.BOOLEAN,
            allowNull    : true,
            defaultvalue : false,
            field        : 'migracion_dori'
          });
        }
      });
  }
};
