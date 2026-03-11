'use strict';

const util = require('../../lib/util');
const lang = require('../../lang');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id : util.pk('id'),
    ip : {
      type   : DataTypes.TEXT,
      xlabel : lang.t('fields.ip'),
      field  : 'ip'
    },
    state: {
      type   : DataTypes.TEXT,
      xlabel : lang.t('fields.state'),
      field  : 'state'
    },
    estado: {
      type   : DataTypes.TEXT,
      xlabel : lang.t('fields.estado'),
      field  : 'estado'
    },
    parametros: {
      type   : DataTypes.JSONB,
      xlabel : lang.t('fields.parametros'),
      field  : 'parametros'
    },
    navegador: {
      type   : DataTypes.TEXT,
      xlabel : lang.t('fields.navegador'),
      field  : 'navegador'
    },
    userAgent: {
      type   : DataTypes.TEXT,
      xlabel : lang.t('fields.userAgent'),
      field  : 'user_agent'
    },
    tokenSistema: {
      type      : DataTypes.TEXT,
      allowNull : true,
      xlabel    : lang.t('fields.tokenSistema'),
      field     : 'token_sistema'
    },
    tokens: { // id_token, access_token, refresh_token
      type      : DataTypes.JSONB,
      allowNull : true,
      xlabel    : lang.t('fields.tokens'),
      field     : 'tokens'
    },
    idEntidad: {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idEntidad'),
      field  : 'id_entidad'
    },
    idRol: {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idRol'),
      field  : 'id_rol'
    },
    idUsuario: {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idUsuario'),
      field  : 'id_usuario'
    },
    authCiudadania: {
      type   : DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      xlabel : lang.t('fields.auth_ciudadania'),
      field  : 'auth_ciudadania'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const Auth = sequelize.define('auth', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'sys_auth'
  });

  return Auth;
};
