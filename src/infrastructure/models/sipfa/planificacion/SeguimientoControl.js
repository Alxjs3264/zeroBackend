'use strict';

const lang = require('../../../lang');
const util = require('../../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id            : util.pk('id'),
    idSeguimiento : {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idSeguimiento'),
      field  : 'id_seguimiento'
    },
    idUnidadOrganizacional: {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idUnidadOrganizacional'),
      field  : 'id_unidad_organizacional'
    },
    idUnidadOrganizacionalRevisora: {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idUnidadOrganizacionalRevisora'),
      field  : 'id_unidad_organizacional_revisora'
    },
    idUsuarioRevisor: {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idUsuarioRevisor'),
      field  : 'id_usuario_revisor'
    },
    idUsuarioValidador: {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idUsuarioValidador'),
      field  : 'id_usuario_validador'
    },
    validado: {
      type   : DataTypes.BOOLEAN,
      xlabel : lang.t('fields.validado'),
      field  : 'validado'
    },
    fechaRevision: {
      type   : DataTypes.DATE,
      xlabel : lang.t('fields.fechaRevision'),
      field  : 'fecha_revision'
    },
    fechaValidacion: {
      type   : DataTypes.DATE,
      xlabel : lang.t('fields.fechaValidacion'),
      field  : 'fecha_validacion'
    },
    observacion: {
      type   : DataTypes.TEXT,
      xlabel : lang.t('fields.observacion'),
      field  : 'observacion'
    },
    idFormulacion: {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idFormulacion'),
      field  : 'id_formulacion'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestampsGestionDocumental(fields);

  const SeguimientoControl = sequelize.define('seguimiento_control', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'planificacion_seguimiento_control'
  });

  return SeguimientoControl;
};
