'use strict';

const tableName = 'sys_area';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.describeTable(tableName)
      .then(async tableDefinition => {
        if (!tableDefinition.contenido_header) {
          await queryInterface.addColumn(tableName, 'contenido_header', {
            type      : Sequelize.TEXT,
            allowNull : true,
            field     : 'contenido_header'
          });
        }

        if (!tableDefinition.contenido_footer) {
          await queryInterface.addColumn(tableName, 'contenido_footer', {
            type      : Sequelize.TEXT,
            allowNull : true,
            field     : 'contenido_footer'
          });
        }
      });
  }
};
