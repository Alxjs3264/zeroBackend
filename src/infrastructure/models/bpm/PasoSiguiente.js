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
    idPasoSiguiente: {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idPasoSiguiente'),
      field  : 'id_paso_siguiente'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const Paso = sequelize.define('paso_siguiente', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'bpm_paso_siguiente'
  });

  return Paso;
};
