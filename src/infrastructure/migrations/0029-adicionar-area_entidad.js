'use strict';

const { constants } = require('../../common/config');

const tableName = 'sys_area';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.describeTable(tableName)
      .then(async tableDefinition => {
        if (!tableDefinition.id_entidad) {
          await queryInterface.addColumn(tableName, 'id_entidad', {
            type         : Sequelize.UUID,
            defaultValue : constants.Ids.entidad['MINISTERIO DE JUSTICIA'],
            allowNull    : false,
            field        : 'id_entidad'
          });
        }
      });
  }
};
