'use strict';

const tableName = 'gestion_formulario';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.describeTable(tableName)
      .then(async tableDefinition => {
        if (!tableDefinition.configuracion_exportacion) {
          await queryInterface.addColumn(tableName, 'configuracion_exportacion', {
            type         : Sequelize.JSONB,
            allowNull    : false,
            defaultValue : [],
            xlabel       : 'configuracionExportacion',
            field        : 'configuracion_exportacion'
          });
        }
      });
  }
};
