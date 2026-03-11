'use strict';

const tableName = 'sys_area';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.describeTable(tableName)
      .then(async tableDefinition => {
        if (!tableDefinition.tipo_header) {
          await queryInterface.addColumn(tableName, 'tipo_header', {
            type         : Sequelize.STRING(20),
            allowNull    : false,
            defaultValue : 'AREA',
            field        : 'tipo_header'
          });
        }

        if (!tableDefinition.tipo_footer) {
          await queryInterface.addColumn(tableName, 'tipo_footer', {
            type         : Sequelize.STRING(20),
            allowNull    : false,
            defaultValue : 'AREA',
            field        : 'tipo_footer'
          });
        }
      });
  }
};
