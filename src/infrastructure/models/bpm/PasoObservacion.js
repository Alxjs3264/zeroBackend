'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id     : util.pk('id'),
    idPaso : {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idPaso'),
      field  : 'id_paso'
    },
    idPasoObservacion: {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idPasoObservacion'),
      field  : 'id_paso_observacion'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const Paso = sequelize.define('paso_observacion', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'bpm_paso_observacion'
  });

  return Paso;
};
