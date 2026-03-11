'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id        : util.pk('id'),
    idEntidad : {
      type      : DataTypes.UUID,
      xlabel    : lang.t('fields.idEntidad'),
      allowNull : false,
      field     : 'id_entidad'
    },
    idUsuario: {
      type      : DataTypes.UUID,
      xlabel    : lang.t('fields.idUsuario'),
      allowNull : false,
      field     : 'id_usuario'
    },
    idFuncion: {
      type      : DataTypes.UUID,
      xlabel    : lang.t('fields.idFuncion'),
      allowNull : false,
      field     : 'id_funcion'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestampsGestionDocumental(fields);

  const EntidadFlujoDocumental = sequelize.define('sys_entidad_usuario', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'sys_entidad_usuario'
  });

  return EntidadFlujoDocumental;
};
