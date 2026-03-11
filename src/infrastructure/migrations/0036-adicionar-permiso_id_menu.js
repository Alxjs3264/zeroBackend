'use strict';

const tableName = 'sys_permiso';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.describeTable(tableName)
      .then(async tableDefinition => {
        if (!tableDefinition.id_menu) {
          await queryInterface.addColumn(tableName, 'id_menu', {
            type      : Sequelize.UUID,
            allowNull : true,
            field     : 'id_menu'
          });
        }
      });
  }
};
