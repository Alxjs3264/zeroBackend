'use strict';

const tableName = 'bpm_paso';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.describeTable(tableName)
      .then(async tableDefinition => {
        if (!tableDefinition.id_entidad) {
          await queryInterface.addColumn(tableName, 'id_entidad', {
            type      : Sequelize.UUID,
            allowNull : true,
            xlabel    : 'idEntidad',
            field     : 'id_entidad'
          });
        }

        if (!tableDefinition.mostrar_entidad) {
          await queryInterface.addColumn(tableName, 'mostrar_entidad', {
            type         : Sequelize.BOOLEAN,
            allowNull    : false,
            defaultValue : false,
            xlabel       : 'mostrarEntidad',
            field        : 'mostrar_entidad'
          });
        }
      });
  }
};
