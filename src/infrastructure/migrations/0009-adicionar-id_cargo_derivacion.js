'use strict';

const tableName = 'gestion_flujo_derivacion';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.describeTable(tableName)
      .then(async tableDefinition => {
        if (!tableDefinition.id_cargo_remitente) {
          await queryInterface.addColumn(tableName, 'id_cargo_remitente', {
            type      : Sequelize.UUID,
            allowNull : true,
            xlabel    : 'idCargoRemitente',
            field     : 'id_cargo_remitente'
          });
        }

        if (!tableDefinition.id_cargo_destinatario) {
          await queryInterface.addColumn(tableName, 'id_cargo_destinatario', {
            type      : Sequelize.UUID,
            allowNull : true,
            xlabel    : 'idCargoDestinatario',
            field     : 'id_cargo_destinatario'
          });
        }

        return Promise.resolve();
      });
  }
};
