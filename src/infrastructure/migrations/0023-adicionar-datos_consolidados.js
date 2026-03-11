'use strict';

const tableName = 'gestion_flujo_documental';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.describeTable(tableName)
      .then(async tableDefinition => {
        if (!tableDefinition.datos_consolidados) {
          await queryInterface.addColumn(tableName, 'datos_consolidados', {
            type         : Sequelize.JSONB,
            allowNull    : false,
            defaultValue : {},
            xlabel       : 'datosConsolidados',
            field        : 'datos_consolidados'
          });
        }
      });
  }
};
