'use strict';

const { constants } = require('../../../common/config');
const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id        : util.pk('id'),
    idEntidad : {
      type         : DataTypes.UUID,
      allowNull    : false,
      defaultValue : constants.Ids.entidad['MINISTERIO DE JUSTICIA'],
      xlabel       : lang.t('fields.idEntidad'),
      field        : 'id_entidad'
    },
    nombreArea: {
      type      : DataTypes.STRING(500),
      allowNull : false,
      xlabel    : lang.t('fields.nombreArea'),
      field     : 'nombre_area'
    },
    sigla: {
      type      : DataTypes.STRING(15),
      allowNull : false,
      xlabel    : lang.t('fields.sigla'),
      field     : 'sigla'
    },
    usuarioResponsable: {
      type      : DataTypes.UUID,
      allowNull : true,
      xlabel    : lang.t('fields.usuarioResponsable'),
      field     : 'usuario_responsable'
    },
    tipoHeader: {
      type         : DataTypes.STRING(20),
      allowNull    : false,
      defaultValue : 'AREA',
      xlabel       : lang.t('fields.tipoHeader'),
      field        : 'tipo_header'
    },
    contenidoHeader: {
      type      : DataTypes.TEXT,
      allowNull : true,
      xlabel    : lang.t('fields.contenidoHeader'),
      field     : 'contenido_header'
    },
    tipoFooter: {
      type         : DataTypes.STRING(20),
      allowNull    : false,
      defaultValue : 'AREA',
      xlabel       : lang.t('fields.tipoFooter'),
      field        : 'tipo_footer'
    },
    contenidoFooter: {
      type      : DataTypes.TEXT,
      allowNull : true,
      xlabel    : lang.t('fields.contenidoFooter'),
      field     : 'contenido_footer'
    },
    estado: {
      type         : DataTypes.STRING(100),
      allowNull    : false,
      xlabel       : lang.t('fields.estado'),
      defaultValue : 'ACTIVO',
      field        : 'estado'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const Area = sequelize.define('area', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'sys_area'
  });

  return Area;
};
