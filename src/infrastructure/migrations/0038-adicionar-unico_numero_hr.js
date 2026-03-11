'use strict';

const tableName = 'gestion_flujo_documental';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.describeTable(tableName)
      .then(async tableDefinition => {
        if (!tableDefinition.numero_hr) {
          await queryInterface.addColumn(tableName, 'numero_hr', {
            type      : Sequelize.STRING(100),
            allowNull : true,
            unique    : true,
            field     : 'numero_hr'
          });
        }
      });
  }
};
