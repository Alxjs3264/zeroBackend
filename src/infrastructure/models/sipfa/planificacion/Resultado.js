'use strict';

const lang = require('../../../lang');
const util = require('../../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id          : util.pk('id'),
    idOperacion : {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idOperacion'),
      field  : 'idOperacion'
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
    tareas: {
      type   : DataTypes.JSONB,
      xlabel : lang.t('fields.tareas'),
      field  : 'tareas'
    },
    mediosVerificacion: {
      type   : DataTypes.JSONB,
      xlabel : lang.t('fields.mediosVerificacion'),
      field  : 'medios_verificacion'
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
    meta: {
      type   : DataTypes.INTEGER,
      xlabel : lang.t('fields.meta'),
      field  : 'meta'
    },
    idIndicadorMeta: {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idIndicadorMeta'),
      field  : 'id_indicador_meta'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestampsGestionDocumental(fields);

  const Resultado = sequelize.define('resultado', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'planificacion_resultado'
  });

  return Resultado;
};
