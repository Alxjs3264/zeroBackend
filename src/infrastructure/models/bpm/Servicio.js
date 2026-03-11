'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id     : util.pk('id'),
    nombre : {
      type   : DataTypes.STRING(500),
      xlabel : lang.t('fields.nombre'),
      field  : 'nombre'
    },
    descripcion: {
      type   : DataTypes.TEXT,
      xlabel : lang.t('fields.descripcion'),
      field  : 'descripcion'
    },
    urlBase: {
      type   : DataTypes.STRING(200),
      xlabel : lang.t('fields.urlBase'),
      field  : 'url_base'
    },
    urlServicio: {
      type   : DataTypes.STRING(200),
      xlabel : lang.t('fields.urlServicio'),
      field  : 'url_servicio'
    },
    urlStatus: {
      type   : DataTypes.STRING(200),
      xlabel : lang.t('fields.urlStatus'),
      field  : 'url_status'
    },
    metodo: {
      type   : DataTypes.ENUM,
      values : ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      xlabel : lang.t('fields.urlStatus'),
      field  : 'metodo'
    },
    token: {
      type   : DataTypes.TEXT,
      xlabel : lang.t('fields.token'),
      field  : 'token'
    },
    tipo: {
      type         : DataTypes.STRING(50),
      allowNull    : false,
      defaultValue : 'CONSUMIR SERVICIO',
      field        : 'tipo'
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

  const Paso = sequelize.define('servicio', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'bpm_servicio'
  });

  return Paso;
};
