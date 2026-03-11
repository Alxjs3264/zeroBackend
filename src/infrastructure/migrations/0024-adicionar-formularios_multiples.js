'use strict';

const tableName = 'bpm_paso';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.describeTable(tableName)
      .then(async tableDefinition => {
        if (!tableDefinition.multiples_formularios) {
          await queryInterface.addColumn(tableName, 'multiples_formularios', {
            type         : Sequelize.BOOLEAN,
            allowNull    : false,
            defaultValue : false,
            xlabel       : 'multiplesFormularios',
            field        : 'multiples_formularios'
          });
        }

        if (!tableDefinition.lista_formularios) {
          await queryInterface.addColumn(tableName, 'lista_formularios', {
            type         : Sequelize.JSONB,
            allowNull    : false,
            defaultValue : [],
            xlabel       : 'listaFormularios',
            field        : 'lista_formularios'
          });
        }

        if (!tableDefinition.campo) {
          await queryInterface.addColumn(tableName, 'campo', {
            type         : Sequelize.JSONB,
            allowNull    : true,
            defaultValue : null,
            xlabel       : 'campo',
            field        : 'campo'
          });
        }
      });
  }
};
