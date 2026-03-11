'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id : util.pk('id'),
    grado       : {
      type   : DataTypes.STRING(150),
      xlabel : lang.t('fields.grado'),
      field  : 'grado'
    },
    nombres: {
      type   : DataTypes.STRING(150),
      xlabel : lang.t('fields.nombres'),
      field  : 'nombres'
    },
    apellidos: {
      type   : DataTypes.STRING(150),
      xlabel : lang.t('fields.apellidos'),
      field  : 'apellidos'
    },
    cargo: {
      type   : DataTypes.STRING(250),
      xlabel : lang.t('fields.cargo'),
      field  : 'cargo'
    },
    entidad: {
      type   : DataTypes.STRING(250),
      xlabel : lang.t('fields.entidad'),
      field  : 'entidad'
    },
    tipoEntidad: {
      type   : DataTypes.STRING(250),
      xlabel : lang.t('fields.tipoEntidad'),
      field  : 'tipo_entidad'
    },
    entidadsigla: {
      type   : DataTypes.STRING(250),
      xlabel : lang.t('fields.entidadsigla'),
      field  : 'entidadsigla'
    },
    direccion: {
      type   : DataTypes.TEXT,
      xlabel : lang.t('fields.direccion'),
      field  : 'direccion'
    },
    telefono: {
      type   : DataTypes.TEXT,
      xlabel : lang.t('fields.telefono'),
      field  : 'telefono'
    },
    departamento: {
      type   : DataTypes.STRING(50),
      xlabel : lang.t('fields.departamento'),
      field  : 'departamento'
    },
    estado: {
      type   : DataTypes.STRING(1000),
      xlabel : lang.t('fields.estado'),
      field  : 'estado'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestampsGestionDocumental(fields);

  const Contacto = sequelize.define('contacto', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'gestion_contacto'
  });

  return Contacto;
};
