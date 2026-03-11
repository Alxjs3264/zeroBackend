'use strict';

const lang = require('../../../lang');
const util = require('../../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id          : util.pk('id'),
    idResultado : {  // llave foranea de la tabla (resultado)
      type   : DataTypes.UUID,
      allowNull : false,
      xlabel : lang.t('fields.idResultado'),
      field  : 'id_resultado'
    },
    mes: {
      type   : DataTypes.INTEGER,
      allowNull : false,
      xlabel : lang.t('fields.mes'),
      field  : 'mes'
    },
    cantidadProgramada: {
      type      : DataTypes.INTEGER,
      allowNull : false,
      xlabel    : lang.t('fields.cantidadProgramada'),
      field     : 'cantidad_programada'
    },
    cantidadCumplida: {
      type      : DataTypes.INTEGER,
      allowNull : true,
      xlabel    : lang.t('fields.cantidadCumplida'),
      field     : 'cantidad_cumplida'
    },
    fechaRegistroCumplimiento: {
      type      : DataTypes.DATEONLY,
      allowNull : true,
      xlabel    : lang.t('fields.fechaRegistroCumplimiento'),
      field     : 'fecha_registro_cumplimiento'
    },
    idUsuarioRegistroCumplimiento: { // llave foranea de la tabla (usuario)
      type      : DataTypes.UUID,
      allowNull : true,
      xlabel    : lang.t('fields.idUsuarioRegistroCumplimiento'),
      field     : 'id_usuario_registro_cumplimiento'
    },
    observacion : {
      type      : DataTypes.TEXT,
      allowNull : true,
      xlabel    : lang.t('fields.observacion'),
      field     : 'observacion'
    },
    meta: {
      type      : DataTypes.INTEGER,
      allowNull : true,
      xlabel    : lang.t('fields.meta'),
      field     : 'meta'
    },
    idIndicadorMeta: { // llave foranea de la tabla (usuario)
      type      : DataTypes.UUID,
      allowNull : true,
      xlabel    : lang.t('fields.idIndicadorMeta'),
      field     : 'id_indicador_meta'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestampsGestionDocumental(fields);

  const Cronograma = sequelize.define('cronograma', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'planificacion_cronograma'
  });

  return Cronograma;
};
