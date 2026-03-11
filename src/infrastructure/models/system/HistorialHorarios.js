'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id        : util.pk('id'),
    idUsuario : {
      type      : DataTypes.UUID,
      allowNull : false,
      xlabel    : lang.t('fields.idUsuario'),
      field     : 'id_usuario'
    },
    motivo: {
      type         : DataTypes.TEXT,
      allowNull    : false,
      defaultValue : '',
      xlabel       : lang.t('fields.motivo'),
      field        : 'motivo'
    },
    lunes: {
      type         : DataTypes.JSONB,
      allowNull    : true,
      defaultValue : null,
      xlabel       : lang.t('fields.lunes'),
      field        : 'lunes'
    },
    martes: {
      type         : DataTypes.JSONB,
      allowNull    : true,
      defaultValue : null,
      xlabel       : lang.t('fields.martes'),
      field        : 'martes'
    },
    miercoles: {
      type         : DataTypes.JSONB,
      allowNull    : true,
      defaultValue : null,
      xlabel       : lang.t('fields.miercoles'),
      field        : 'miercoles'
    },
    jueves: {
      type         : DataTypes.JSONB,
      allowNull    : true,
      defaultValue : null,
      xlabel       : lang.t('fields.jueves'),
      field        : 'jueves'
    },
    viernes: {
      type         : DataTypes.JSONB,
      allowNull    : true,
      defaultValue : null,
      xlabel       : lang.t('fields.viernes'),
      field        : 'viernes'
    },
    sabado: {
      type         : DataTypes.JSONB,
      allowNull    : true,
      defaultValue : null,
      xlabel       : lang.t('fields.sabado'),
      field        : 'sabado'
    },
    domingo: {
      type         : DataTypes.JSONB,
      allowNull    : true,
      defaultValue : null,
      xlabel       : lang.t('fields.domingo'),
      field        : 'domingo'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const HistorialHorarios = sequelize.define('historial_horarios', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'sys_historial_horarios'
  });

  return HistorialHorarios;
};
