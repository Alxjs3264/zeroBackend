'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id        : util.pk('id'),
    idTramite : {
      type      : DataTypes.UUID,
      allowNull : false,
      xlabel    : lang.t('fields.idTramite'),
      field     : 'id_tramite'
    },
    envio: {
      type      : DataTypes.JSONB,
      allowNull : true,
      xlabel    : lang.t('fields.envio'),
      field     : 'envio'
    },
    fechaEnvio: {
      type      : DataTypes.DATE,
      allowNull : true,
      xlabel    : lang.t('fields.fechaEnvio'),
      field     : 'fecha_envio'
    },
    respuesta: {
      type      : DataTypes.JSONB,
      allowNull : true,
      xlabel    : lang.t('fields.respuesta'),
      field     : 'respuesta'
    },
    fechaRespuesta: {
      type      : DataTypes.DATE,
      allowNull : true,
      xlabel    : lang.t('fields.fechaRespuesta'),
      field     : 'fecha_respuesta'
    },
    notificacion: {
      type      : DataTypes.JSONB,
      allowNull : true,
      xlabel    : lang.t('fields.notificacion'),
      field     : 'notificacion'
    },
    fechaNotificacion: {
      type      : DataTypes.DATE,
      allowNull : true,
      xlabel    : lang.t('fields.fechaNotificacion'),
      field     : 'fecha_notificacion'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const Area = sequelize.define('log_iop', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'sys_log_iop'
  });

  return Area;
};
