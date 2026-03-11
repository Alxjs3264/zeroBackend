'use strict';

const tableName = 'gestion_formulario';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.describeTable(tableName)
      .then(async tableDefinition => {
        if (!tableDefinition.cite_institucional) {
          await queryInterface.addColumn(tableName, 'cite_institucional', {
            type         : Sequelize.BOOLEAN,
            allowNull    : false,
            defaultValue : false,
            xlabel       : 'citeInstitucional',
            field        : 'cite_institucional'
          });
        }
        return Promise.resolve();
      });
  }
};
