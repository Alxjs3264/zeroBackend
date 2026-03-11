'use strict';

const util = require('../lib/util');
const lang = require('../lang');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable('gestion_formulario');
    if (!tableDescription.pertenece_flujo) {
      // Agregar una nueva columna que acepta UUID y es nula por defecto
      await queryInterface.addColumn('gestion_formulario', 'pertenece_flujo', {
        type         : Sequelize.BOOLEAN,
        allowNull    : true,
        defaultValue : false,
        xlabel       : 'pertenceflujo',
        field        : 'pertenece_flujo'
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Deshacer los cambios en caso de un rollback
  }
};
