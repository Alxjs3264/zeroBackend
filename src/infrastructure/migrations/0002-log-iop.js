'use strict';

const util = require('../lib/util');
const lang = require('../lang');

module.exports = {
  up: (queryInterface, Sequelize) => {
    let fields = {
      id        : util.pk('id'),
      idTramite : {
        type      : Sequelize.DataTypes.UUID,
        allowNull : false,
        xlabel    : lang.t('fields.idTramite'),
        field     : 'id_tramite'
      },
      envio: {
        type      : Sequelize.DataTypes.JSONB,
        allowNull : true,
        xlabel    : lang.t('fields.envio'),
        field     : 'envio'
      },
      fechaEnvio: {
        type      : Sequelize.DataTypes.DATE,
        allowNull : true,
        xlabel    : lang.t('fields.fechaEnvio'),
        field     : 'fecha_envio'
      },
      respuesta: {
        type      : Sequelize.DataTypes.JSONB,
        allowNull : true,
        xlabel    : lang.t('fields.respuesta'),
        field     : 'respuesta'
      },
      fechaRespuesta: {
        type      : Sequelize.DataTypes.DATE,
        allowNull : true,
        xlabel    : lang.t('fields.fechaRespuesta'),
        field     : 'fecha_respuesta'
      },
      notificacion: {
        type      : Sequelize.DataTypes.JSONB,
        allowNull : true,
        xlabel    : lang.t('fields.notificacion'),
        field     : 'notificacion'
      },
      fechaNotificacion: {
        type      : Sequelize.DataTypes.DATE,
        allowNull : true,
        xlabel    : lang.t('fields.fechaNotificacion'),
        field     : 'fecha_notificacion'
      }
    };

    // Agregando campos para el log
    fields = util.setTimestamps(fields);

    return queryInterface.createTable('sys_log_iop', fields, {
      paranoid   : false,
      timestamps : false,
      tableName  : 'sys_log_iop'
    });
  }
};
