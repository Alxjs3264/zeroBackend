'use strict';

const lang = require('../../../lang');
const util = require('../../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id      : util.pk('id'),
    nroItem : {
      type      : DataTypes.STRING(200),
      allowNull : true,
      xlabel    : lang.t('fields.nroItem'),
      field     : 'nro_item'
    },
    descripcion: {
      type      : DataTypes.TEXT,
      allowNull : true,
      xlabel    : lang.t('fields.descripcion'),
      field     : 'descripcion'
    },
    idTipoPuesto: { // llave foranea de la tabla (puesto)
      type      : DataTypes.UUID,
      allowNull : false,
      xlabel    : lang.t('fields.idTipoPuesto'),
      field     : 'id_tipo_puesto'
    },
    estado: {
      type         : DataTypes.ENUM,
      defaultValue : 'ACTIVO',
      values       : ['ACTIVO', 'INACTIVO'],
      xlabel       : lang.t('fields.estado'),
      field        : 'estado'
    },
    nivel: {
      type   : DataTypes.ENUM,
      values : ['PRIMERA', 'SEGUNDA', 'TERCERA'],
      xlabel : lang.t('fields.nivel'),
      field  : 'nivel'
    },
    idUnidadOrganizacional: {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idUnidadOrganizacional'),
      field  : 'id_unidad_organizacional'
    },
    ciudadano: {
      type         : DataTypes.BOOLEAN,
      allowNull    : true,
      defaultvalue : false,
      xlabel       : lang.t('fields.ciudadano'),
      field        : 'ciudadano'
    },
    interno: {
      type      : DataTypes.INTEGER,
      allowNull : true,
      xlabel    : lang.t('fields.interno'),
      field     : 'interno'
    },
    ciudad: {
      type      : DataTypes.TEXT,
      allowNull : true,
      xlabel    : lang.t('fields.ciudad'),
      field     : 'ciudad'
    }
  };
  // Agregando campos para el log
  fields = util.setTimestampsGestionDocumental(fields);

  const Cargo = sequelize.define('cargo', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'planificacion_cargo'
  });

  return Cargo;
};
