'use strict';

const tableName = 'gestion_flujo_documental';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.describeTable(tableName)
      .then(async tableDefinition => {
        if (!tableDefinition.copia) {
          await queryInterface.addColumn(tableName, 'copia', {
            type         : Sequelize.BOOLEAN,
            defaultValue : false,
            allowNull    : false,
            xlabel       : 'copia',
            field        : 'copia'
          });
        }
        return Promise.resolve();
      });
  }
};
