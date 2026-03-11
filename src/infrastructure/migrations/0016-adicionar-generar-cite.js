'use strict';

const tableName = 'gestion_formulario';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.describeTable(tableName)
      .then(async tableDefinition => {
        if (!tableDefinition.generar_cite) {
          await queryInterface.addColumn(tableName, 'generar_cite', {
            type         : Sequelize.BOOLEAN,
            allowNull    : false,
            defaultValue : false,
            xlabel       : 'generarCite',
            field        : 'generar_cite'
          });
        }

        if (!tableDefinition.no_observable) {
          await queryInterface.addColumn(tableName, 'no_observable', {
            type         : Sequelize.BOOLEAN,
            allowNull    : false,
            defaultValue : false,
            xlabel       : 'noObservable',
            field        : 'no_observable'
          });
        }
        return Promise.resolve();
      });
  }
};
