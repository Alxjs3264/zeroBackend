'use strict';

const tableName = 'gestion_ejecucion_interoperabilidad';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.describeTable(tableName)
      .then(async tableDefinition => {
        if (!tableDefinition.id_componente) {
          await queryInterface.addColumn(tableName, 'id_componente', {
            type         : Sequelize.UUID,
            allowNull    : true,
            defaultValue : null,
            field        : 'id_componente'
          });
        }
      });
  }
};
