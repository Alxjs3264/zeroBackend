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
    idPasoAnterior: {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idPasoAnterior'),
      field  : 'id_paso_anterior'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const Paso = sequelize.define('paso_anterior', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'bpm_paso_anterior'
  });

  return Paso;
};
