'use strict';

const lang = require('../../../lang');
const util = require('../../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id           : util.pk('id'),
    idEstructura : {
      type      : DataTypes.UUID,
      allowNull : true,
      xlabel    : lang.t('fields.idEstructura'),
      field     : 'id_estructura'
    },
    descripcion: {
      type      : DataTypes.TEXT,
      allowNull : false,
      xlabel    : lang.t('fields.descripcion'),
      field     : 'descripcion'
    },
    programacionHabilitada: {
      type      : DataTypes.BOOLEAN,
      allowNull : false,
      xlabel    : lang.t('fields.programacionHabilitada'),
      field     : 'programacion_habilitada'
    },
    fechaInicioProgramacion: {
      type      : DataTypes.DATEONLY,
      allowNull : false,
      xlabel    : lang.t('fields.fechaInicioProgramacion'),
      field     : 'fecha_inicio_programacion'
    },
    fechaFinProgramacion: {
      type      : DataTypes.DATEONLY,
      allowNull : false,
      xlabel    : lang.t('fields.fechaFinProgramacion'),
      field     : 'fecha_fin_programacion'
    },
    idMonitoreo: {
      type      : DataTypes.UUID,
      allowNull : true,
      xlabel    : lang.t('fields.idMonitoreo'),
      field     : 'id_monitoreo'
    },
    fechaInicioMonitoreo: {
      type      : DataTypes.DATEONLY,
      allowNull : true,
      xlabel    : lang.t('fields.fechaInicioMonitoreo'),
      field     : 'fecha_inicio_monitoreo'
    },
    fechaFinMonitoreo: {
      type      : DataTypes.DATEONLY,
      allowNull : true,
      xlabel    : lang.t('fields.fechaFinMonitoreo'),
      field     : 'fecha_fin_monitoreo'
    },
    idEvaluacion: {
      type      : DataTypes.UUID,
      allowNull : true,
      xlabel    : lang.t('fields.idEvaluacion'),
      field     : 'id_evaluacion'
    },
    fechaInicioEvaluacion: {
      type      : DataTypes.DATEONLY,
      allowNull : true,
      xlabel    : lang.t('fields.fechaInicioEvaluacion'),
      field     : 'fecha_inicio_evaluacion'
    },
    fechaFinEvaluacion: {
      type      : DataTypes.DATEONLY,
      allowNull : true,
      xlabel    : lang.t('fields.fechaFinEvaluacion'),
      field     : 'fecha_fin_evaluacion'
    },
    reformulacionHabilitada: {
      type      : DataTypes.BOOLEAN,
      allowNull : true,
      xlabel    : lang.t('fields.reformulacionHabilitada'),
      field     : 'reformulacion_habilitada'
    },
    fechaInicioReformulacion: {
      type      : DataTypes.DATEONLY,
      allowNull : true,
      xlabel    : lang.t('fields.fechaInicioReformulacion'),
      field     : 'fecha_inicio_reformulacion'
    },
    fechaFinReformulacion: {
      type      : DataTypes.DATEONLY,
      allowNull : true,
      xlabel    : lang.t('fields.fechaFinReformulacion'),
      field     : 'fecha_fin_reformulacion'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestampsGestionDocumental(fields);

  const Gestion = sequelize.define('gestion', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'planificacion_gestion'
  });

  return Gestion;
};
