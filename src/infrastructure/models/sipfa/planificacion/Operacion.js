'use strict';

const lang = require('../../../lang');
const util = require('../../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id            : util.pk('id'),
    idFormulacion : {
      type      : DataTypes.UUID,
      allowNull : true,
      xlabel    : lang.t('fields.idFormulacion'),
      field     : 'id_formulacion'
    },
    idEstructura: {
      allowNull : true,
      type      : DataTypes.UUID,
      xlabel    : lang.t('fields.idEstructura'),
      field     : 'id_estructura'
    },
    idOperacionPadre: {
      allowNull : true,
      type      : DataTypes.UUID,
      xlabel    : lang.t('fields.idOperacionPadre'),
      field     : 'id_operacion_padre'
    },
    codigo: {
      type   : DataTypes.STRING(200),
      xlabel : lang.t('fields.codigo'),
      field  : 'codigo'
    },
    descripcion: {
      type   : DataTypes.TEXT,
      xlabel : lang.t('fields.descripcion'),
      field  : 'descripcion'
    },
    ponderacion: {
      type   : DataTypes.INTEGER,
      xlabel : lang.t('fields.ponderacion'),
      field  : 'ponderacion'
    },
    idIndicadorMeta: {
      allowNull : true,
      type      : DataTypes.UUID,
      xlabel    : lang.t('fields.idIndicadorMeta'),
      field     : 'id_indicador_meta'
    },
    meta: {
      type   : DataTypes.INTEGER,
      xlabel : lang.t('fields.meta'),
      field  : 'meta'
    },
    idUnidadOrganizacional: {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idUnidadOrganizacional'),
      field  : 'id_unidad_organizacional'
    },
    fechaInicio: {
      type   : DataTypes.DATE,
      xlabel : lang.t('fields.fechaInicio'),
      field  : 'fecha_inicio'
    },
    fechaFin: {
      type   : DataTypes.DATE,
      xlabel : lang.t('fields.fechaFin'),
      field  : 'fecha_fin'
    },
    mediosVerificacion: {
      allowNull : true,
      type      : DataTypes.JSONB,
      xlabel    : lang.t('fields.mediosVerificacion'),
      field     : 'medios_verificacion'
    },
    tareas: {
      allowNull : true,
      type      : DataTypes.JSONB,
      xlabel    : lang.t('fields.tareas'),
      field     : 'tareas'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestampsGestionDocumental(fields);

  const Operacion = sequelize.define('operacion', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'planificacion_operacion'
  });

  return Operacion;
};
