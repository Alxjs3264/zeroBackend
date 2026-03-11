'use strict';

const tableName = 'sys_menu';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.describeTable(tableName)
      .then(async tableDefinition => {
        if (!tableDefinition.es_menu) {
          await queryInterface.addColumn(tableName, 'es_menu', {
            type         : Sequelize.BOOLEAN,
            allowNull    : false,
            defaultValue : true,
            field        : 'es_menu'
          });
        }
      });
  }
};
