'use strict';

const tableName = 'bpm_solicitud_plantilla';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.describeTable(tableName)
      .then(async tableDefinition => {
        if (!tableDefinition.id_entidad) {
          await queryInterface.addColumn(tableName, 'id_entidad', {
            type         : Sequelize.UUID,
            allowNull    : true,
            defaultValue : null,
            xlabel       : 'idEntidad',
            field        : 'id_entidad'
          });
        }

        if (!tableDefinition.id_areas) {
          await queryInterface.addColumn(tableName, 'id_areas', {
            type         : Sequelize.TEXT,
            allowNull    : true,
            defaultValue : null,
            xlabel       : 'idAreas',
            field        : 'id_areas'
          });
        }

        return Promise.resolve();
      });
  }
};
