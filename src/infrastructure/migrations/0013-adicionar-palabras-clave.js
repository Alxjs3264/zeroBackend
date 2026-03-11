'use strict';

const tableName = 'gestion_documento';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.describeTable(tableName)
      .then(async tableDefinition => {
        if (!tableDefinition.palabras_clave) {
          await queryInterface.addColumn(tableName, 'palabras_clave', {
            type         : Sequelize.TEXT,
            allowNull    : true,
            defaultValue : null,
            xlabel       : 'palabrasClave',
            field        : 'palabras_clave'
          });
        }
        return Promise.resolve();
      });
  }
};
