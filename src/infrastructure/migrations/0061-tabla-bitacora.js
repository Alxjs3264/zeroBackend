'use strict';

const util = require('../lib/util');
const lang = require('../lang');

module.exports = {
  up: (queryInterface, Sequelize) => {
    let fields = {
      id        : util.pk('id'),
      nombreTabla: {
        type      : Sequelize.DataTypes.STRING(100),
        allowNull : false,
        xlabel    : lang.t('fields.nombreTabla'),
        field     : 'nombre_tabla'
      },
      idUsuario: {
        type      : Sequelize.DataTypes.UUID,
        allowNull : false,
        xlabel    : lang.t('fields.idUsuario'),
        field     : 'id_usuario'
      },
      idItem : {
        type      : Sequelize.DataTypes.UUID,
        allowNull : false,
        xlabel    : lang.t('fields.idItem'),
        field     : 'id_item'
      },
      accion: {
        type      : Sequelize.DataTypes.STRING(50),
        allowNull : false,
        xlabel    : lang.t('fields.accion')
      },
      justificacion: {
        type   : Sequelize.DataTypes.TEXT,
        allowNull : true,
        defaultValue: null,
        xlabel : lang.t('fields.justificacion')
      }
    };

    // Agregando campos para el log
    fields = util.setTimestamps(fields);

    return queryInterface.createTable('sys_bitacora', fields, {
      paranoid   : true,
      timestamps : true,
      tableName  : 'sys_bitacora'
    });
  }
};
