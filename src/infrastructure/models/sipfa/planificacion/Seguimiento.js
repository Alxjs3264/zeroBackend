'use strict';

const lang = require('../../../lang');
const util = require('../../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id          : util.pk('id'),
    descripcion : {
      type   : DataTypes.TEXT,
      xlabel : lang.t('fields.descripcion'),
      field  : 'descripcion'
    },
    idTipoSeguimiento: {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idTipoSeguimiento'),
      field  : 'id_tipo_seguimiento'
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
    }
  };

  // Agregando campos para el log
  fields = util.setTimestampsGestionDocumental(fields);

  const Seguimiento = sequelize.define('seguimiento', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'planificacion_seguimiento'
  });

  return Seguimiento;
};
