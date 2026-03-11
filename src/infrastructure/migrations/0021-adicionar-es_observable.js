'use strict';

const tableName = 'gestion_flujo_derivacion';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.describeTable(tableName)
      .then(async tableDefinition => {
        if (!tableDefinition.es_observable) {
          await queryInterface.addColumn(tableName, 'es_observable', {
            type         : Sequelize.BOOLEAN,
            allowNull    : false,
            defaultValue : true,
            xlabel       : 'esObservable',
            field        : 'es_observable'
          });
        }
      });
  }
};
