'use strict';

const lang = require('../../../lang');
const util = require('../../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id                : util.pk('id'),
    idEstructuraPadre : { // llave foranea de la tabla (estructura)
      type      : DataTypes.UUID,
      allowNull : true,
      xlabel    : lang.t('fields.idEstructuraPadre'),
      field     : 'id_estructura_padre'
    },
    nombre: {
      type      : DataTypes.STRING(200),
      allowNull : false,
      xlabel    : lang.t('fields.nombre'),
      field     : 'nombre'
    },
    nivel: {
      type      : DataTypes.INTEGER,
      allowNull : false,
      xlabel    : lang.t('fields.nivel'),
      field     : 'nivel'
    },
    sigla: {
      type      : DataTypes.STRING(50),
      allowNull : false,
      xlabel    : lang.t('fields.sigla'),
      field     : 'sigla'
    },
    nombreIndicador: {
      type      : DataTypes.STRING(200),
      allowNull : true,
      xlabel    : lang.t('fields.nombreIndicador'),
      field     : 'nombre_indicador'
    },
    estado: {
      type   : DataTypes.ENUM,
      values : ['ACTIVO', 'INACTIVO'],
      xlabel : lang.t('fields.estado'),
      field  : 'estado'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestampsGestionDocumental(fields);

  const Estructura = sequelize.define('estructura', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'planificacion_estructura'
  });

  return Estructura;
};
