'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id     : util.pk('id'),
    nombreTabla : {
      type      : DataTypes.STRING(100),
      allowNull : false,
      xlabel    : lang.t('fields.nombreTabla'),
      field  : 'nombre_tabla'
    },
    idUsuario: {
      type      : DataTypes.UUID,
      allowNull : false,
      xlabel    : lang.t('fields.idUsuario'),
      field     : 'id_usuario'
    },
    idItem : {
      type      : DataTypes.UUID,
      allowNull : false,
      xlabel    : lang.t('fields.idItem'),
      field     : 'id_item'
    },
    accion: {
      type      : DataTypes.STRING(50),
      allowNull : false,
      xlabel    : lang.t('fields.accion'),
      field     : 'accion'
    },
    justificacion: {
      type   : DataTypes.TEXT,
      allowNull : true,
      defaultValue: null,
      xlabel : lang.t('fields.justificacion'),
      field     : 'justificacion'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const Bitacora = sequelize.define('bitacora', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'sys_bitacora'
  });

  return Bitacora;
};
