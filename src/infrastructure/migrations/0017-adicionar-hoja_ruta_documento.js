'use strict';

const tableName = 'gestion_documento';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.describeTable(tableName)
      .then(async tableDefinition => {
        if (!tableDefinition.hoja_ruta) {
          await queryInterface.addColumn(tableName, 'hoja_ruta', {
            type      : Sequelize.STRING(250),
            allowNull : true,
            xlabel    : 'hojaRuta',
            field     : 'hoja_ruta'
          });
        }
      });
  }
};
