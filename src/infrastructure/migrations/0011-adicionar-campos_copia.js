'use strict';

const tableName = 'gestion_documento';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.describeTable(tableName)
      .then(async tableDefinition => {
        if (!tableDefinition.id_documento_original) {
          await queryInterface.addColumn(tableName, 'id_documento_original', {
            type         : Sequelize.UUID,
            allowNull    : true,
            defaultValue : null,
            xlabel       : 'idDocumentoOriginal',
            field        : 'id_documento_original'
          });
        }
        return Promise.resolve();
      });
  }
};
