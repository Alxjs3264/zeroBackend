'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id        : util.pk('id'),
    idUsuario : {
      type      : DataTypes.UUID,
      allowNull : true,
      xlabel    : lang.t('fields.idUsuario'),
      field     : 'id_usuario'
    },
    idCargo: {
      type      : DataTypes.UUID,
      allowNull : true,
      xlabel    : lang.t('fields.idCargo'),
      field     : 'id_cargo'
    },
    estado: {
      type         : DataTypes.ENUM,
      values       : ['ACTIVO', 'INACTIVO'],
      defaultValue : 'ACTIVO',
      allowNull    : false,
      xlabel       : lang.t('fields.estado'),
      field        : 'estado'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const UsuarioCargo = sequelize.define('usuario_cargo', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'sys_usuario_cargo'
  });

  return UsuarioCargo;
};
