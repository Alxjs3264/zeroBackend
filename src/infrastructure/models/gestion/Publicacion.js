'use strict';

const { config } = require('../../../common');
const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id        : util.pk('id'),
    contenido : {
      type   : DataTypes.TEXT,
      xlabel : lang.t('fields.contenido'),
      field  : 'contenido'
    },
    nombreArchivo: {
      type   : DataTypes.STRING(300),
      xlabel : lang.t('fields.nombreArchivo'),
      field  : 'nombre_achivo',
      get    : function () {
        if (this.getDataValue('nombreArchivo')) {
          return `${config.app.backendUrl}${this.getDataValue('nombreArchivo')}`;
        }
        return null;
      }
    },
    areas: {
      type      : DataTypes.TEXT,
      xlabel    : lang.t('fields.areas'),
      allowNull : true,
      field     : 'areas'
    },
    idUsuario: {
      type      : DataTypes.UUID,
      xlabel    : lang.t('fields.idUsuario'),
      allowNull : false,
      field     : 'idUsuario'
    },
    idCategoria: {
      type      : DataTypes.UUID,
      xlabel    : lang.t('fields.idCategoria'),
      allowNull : true,
      defaultValue: null,
      field     : 'id_categoria'
    },
    estado: {
      type         : DataTypes.ENUM,
      values       : ['ACTIVO', 'INACTIVO'],
      defaultValue : 'ACTIVO',
      xlabel       : lang.t('fields.estado'),
      field        : 'estado'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestampsGestionDocumental(fields);

  const Contacto = sequelize.define('publicacion', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'gestion_publicacion'
  });

  return Contacto;
};
