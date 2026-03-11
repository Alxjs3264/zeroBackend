'use strict';

const util = require('../lib/util');
const lang = require('../lang');

module.exports = {
  up: (queryInterface, Sequelize) => {
    let fields = {
      id        : util.pk('id'),
      idEntidad : {
        type      : Sequelize.UUID,
        xlabel    : lang.t('fields.idEntidad'),
        allowNull : false,
        field     : 'id_entidad'
      },
      idUsuario: {
        type      : Sequelize.UUID,
        xlabel    : lang.t('fields.idUsuario'),
        allowNull : false,
        field     : 'id_usuario'
      },
      idFuncion: {
        type      : Sequelize.UUID,
        xlabel    : lang.t('fields.idFuncion'),
        allowNull : false,
        field     : 'id_funcion'
      }
    };

    // Agregando campos para el log
    fields = util.setTimestamps(fields);

    return queryInterface.createTable('sys_entidad_usuario', fields, {
      paranoid   : true,
      timestamps : true,
      tableName  : 'sys_entidad_usuario'
    });
  }
};
