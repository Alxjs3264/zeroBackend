'use strict';

const tableName = 'sys_aprobacion_documentos';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.describeTable(tableName)
      .then(async tableDefinition => {
        if (!tableDefinition.id_flujo) {
          await queryInterface.addColumn(tableName, 'id_flujo', {
            type      : Sequelize.UUID,
            allowNull : true,
            xlabel    : 'idFlujo',
            field     : 'id_flujo'
          });
        }
      });
  }
};
