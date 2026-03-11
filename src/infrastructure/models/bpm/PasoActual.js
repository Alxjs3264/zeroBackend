'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id                : util.pk('id'),
    idFlujoDocumental : {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idFlujoDocumental'),
      field  : 'id_flujo_documental'
    },
    idPaso: {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idPaso'),
      field  : 'id_paso'
    },
    estado: {
      type         : DataTypes.ENUM,
      values       : ['PENDIENTE', 'FINALIZADO'],
      defaultValue : 'PENDIENTE',
      xlabel       : lang.t('fields.estado'),
      field        : 'estado'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const Paso = sequelize.define('paso_actual', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'bpm_paso_actual'
  });

  return Paso;
};
