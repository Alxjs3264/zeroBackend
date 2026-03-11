'use strict';

const tableName = 'gestion_flujo_documental';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.describeTable(tableName)
      .then(async tableDefinition => {
        if (!tableDefinition.id_flujo_origen) {
          await queryInterface.addColumn(tableName, 'id_flujo_origen', {
            type      : Sequelize.UUID,
            allowNull : true,
            xlabel    : 'idFlujoOrigen',
            field     : 'id_flujo_origen'
          });
        }

        if (!tableDefinition.id_flujo_destino) {
          await queryInterface.addColumn(tableName, 'id_flujo_destino', {
            type      : Sequelize.UUID,
            allowNull : true,
            xlabel    : 'idFlujoDestino',
            field     : 'id_flujo_destino'
          });
        }
      });
  }
};
