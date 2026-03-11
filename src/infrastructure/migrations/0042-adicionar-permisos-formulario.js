'use strict';

const util = require('../lib/util');
const lang = require('../lang');

module.exports = {
  up: (queryInterface, Sequelize) => {
    let fields = {
      id        : util.pk('id'),
      idEntidad : {
        type      : Sequelize.DataTypes.UUID,
        allowNull : true,
        xlabel    : lang.t('fields.idEntidad'),
        field     : 'id_entidad'
      },
      idArea: {
        type      : Sequelize.DataTypes.UUID,
        allowNull : true,
        xlabel    : lang.t('fields.idArea'),
        field     : 'id_area'
      },
      idFormulario: {
        type      : Sequelize.DataTypes.UUID,
        allowNull : false,
        xlabel    : lang.t('fields.idFormulario'),
        field     : 'id_formulario'
      }
    };

    // Agregando campos para el log
    fields = util.setTimestamps(fields);

    return queryInterface.createTable('sys_permisos_formulario', fields, {
      paranoid   : true,
      timestamps : true,
      tableName  : 'sys_permisos_formulario'
    });
  }
};
