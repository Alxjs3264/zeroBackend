'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id        : util.pk('id'),
    idUsuario : {
      type      : DataTypes.UUID,
      xlabel    : lang.t('fields.idUsuario'),
      allowNull : true,
      field     : 'id_usuario'
    },
    nombreEntidad: {
      type   : DataTypes.STRING(500),
      xlabel : lang.t('fields.nombreEntidad'),
      field  : 'nombre_entidad',
      unique : true
    },
    token: {
      type   : DataTypes.STRING(1500),
      xlabel : lang.t('fields.token'),
      field  : 'token'
    },
    endpoints: {
      type   : DataTypes.JSON,
      xlabel : lang.t('fields.endpoints'),
      field  : 'endpoints'
    },
    activo: {
      type         : DataTypes.BOOLEAN,
      xlabel       : lang.t('fields.activo'),
      defaultValue : true,
      field        : 'activo'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const ApitokenEndpoint = sequelize.define('apitoken_endpoint', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'sys_apitoken_endppoint'
  });

  return ApitokenEndpoint;
};
