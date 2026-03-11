'use strict';

const lang = require('../../../lang');
const util = require('../../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
       id           : util.pk('id'),
       idOperacion  : {
        type   : DataTypes.UUID,
        xlabel : lang.t('fields.idOperacion'),
        field  : 'id_operacion'
      },
      idProgramacion  : {
        type   : DataTypes.UUID,
        xlabel : lang.t('fields.idProgramacion'),
        field  : 'id_programacion'
      },
      accion: {
         type   : DataTypes.STRING(200),
         xlabel : lang.t('fields.accion'),
         field  : 'accion'
      },
      registro: {
        type   : DataTypes.STRING(200),
        xlabel : lang.t('fields.registro'),
        field  : 'registro'
      },
      observaciones: {
        type   : DataTypes.STRING(200),
        xlabel : lang.t('fields.observaciones'),
        field  : 'observaciones'
       },
  }
  fields = util.setTimestampsGestionDocumental(fields);

  const OperacionHistorial = sequelize.define('operacion_historial', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'planificacion_operacion_historial'
  });

  return OperacionHistorial;
};
