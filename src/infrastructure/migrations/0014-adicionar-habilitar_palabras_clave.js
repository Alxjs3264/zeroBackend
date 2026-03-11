'use strict';

const tableName = 'gestion_formulario';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.describeTable(tableName)
      .then(async tableDefinition => {
        if (!tableDefinition.habilitar_palabras_clave) {
          await queryInterface.addColumn(tableName, 'habilitar_palabras_clave', {
            type         : Sequelize.BOOLEAN,
            allowNull    : true,
            defaultValue : false,
            xlabel       : 'habilitarPalabrasClave',
            field        : 'habilitar_palabras_clave'
          });
        }
        return Promise.resolve();
      });
  }
};
