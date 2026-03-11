'use strict';

const tableName = 'sys_usuario';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.describeTable(tableName)
      .then(async tableDefinition => {
        if (!tableDefinition.no_vidente) {
          await queryInterface.addColumn(tableName, 'no_vidente', {
            type         : Sequelize.BOOLEAN,
            allowNull    : false,
            defaultValue : false,
            xlabel       : 'noVidente',
            field        : 'no_vidente'
          });
        }
        return Promise.resolve();
      });
  }
};
