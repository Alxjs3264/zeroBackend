'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id     : util.pk('id'),
    nombre : {
      type      : DataTypes.STRING(200),
      allowNull : false,
      xlabel    : lang.t('fields.nombre')
    },
    descripcion: {
      type      : DataTypes.STRING(200),
      allowNull : false,
      xlabel    : lang.t('fields.descripcion')
    },
    icono: {
      type      : DataTypes.STRING(200),
      allowNull : true,
      xlabel    : lang.t('fields.icono')
    },
    estado: {
      type   : DataTypes.ENUM,
      values : ['ACTIVO', 'INACTIVO'],
      xlabel : lang.t('fields.estado'),
      field  : 'estado'
    },
    tipo: {
      type   : DataTypes.ENUM,
      values : ['BASICO', 'AVANZADO'],
      xlabel : lang.t('fields.tipo'),
      field  : 'tipo'
    },
    configuracion_json: {
      type      : DataTypes.JSON,
      allowNull : false,
      xlabel    : lang.t('fields.configuracion_json'),
      field     : 'configuracion_json'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const componente = sequelize.define('componente', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'gestion_componente'
  });

  return componente;
};
