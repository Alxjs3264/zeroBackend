'use strict';

const tableName = 'sys_entidad';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable(tableName);
    if (!tableDescription.codigo) {
      return queryInterface.describeTable(tableName)
        .then(async tableDefinition => {
          if (!tableDefinition.datos_consolidados) {
            await queryInterface.addColumn(tableName, 'codigo', {
              type      : Sequelize.INTEGER,
              length    : 4,
              allowNull : true,
              field     : 'codigo'
            });
          }
        });
    }
  }
};
