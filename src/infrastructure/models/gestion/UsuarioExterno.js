'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id             : util.pk('id'),
    nombreCompleto : {
      type      : DataTypes.STRING(100),
      allowNull : false,
      xlabel    : lang.t('fields.nombreCompleto'),
      field     : 'nombre_completo'
    },
    cargo: {
      type      : DataTypes.STRING(100),
      allowNull : true,
      xlabel    : lang.t('fields.cargo')
    },
    procedencia: {
      type      : DataTypes.STRING(100),
      allowNull : true,
      xlabel    : lang.t('fields.procedencia')
    },
    estado: {
      type   : DataTypes.ENUM,
      values : ['ACTIVO', 'INACTIVO'],
      xlabel : lang.t('fields.estado'),
      field  : 'estado'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const Parametro = sequelize.define('usuario_externo', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'gestion_usuario_externo'
  });

  return Parametro;
};
