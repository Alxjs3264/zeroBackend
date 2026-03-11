'use strict';

const util = require('../lib/util');
const lang = require('../lang');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Modificar el nombre de la columna existente
    const tabla = 'gestion_documento_observacion';
    const tableDescription = await queryInterface.describeTable(tabla);
    // if (!tableDescription.id_usuario_onservacion) {
    //   await queryInterface.renameColumn(tabla, 'id_usuario_onservacion', 'id_usuario_revisor');
    // }
    if (!tableDescription.id_usuario_observado) {
      await queryInterface.addColumn(tabla, 'id_usuario_observado', {
        type         : Sequelize.UUID,
        defaultValue : null,
        references   : {
          model : 'sys_usuario',
          key   : 'id'
        }
      });
      // Agregar una nueva columna que acepta UUID y es nula por defecto
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Deshacer los cambios en caso de un rollback
  }
};
