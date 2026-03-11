'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id     : util.pk('id'),
    idPaso : {
      type      : DataTypes.UUID,
      allowNull : true,
      xlabel    : lang.t('fields.idPaso'),
      field     : 'id_paso'
    },
    idFlujo: {
      type      : DataTypes.UUID,
      allowNull : true,
      xlabel    : lang.t('fields.idFlujo'),
      field     : 'id_flujo'
    },
    idDocumento: {
      type      : DataTypes.UUID,
      allowNull : true,
      xlabel    : lang.t('fields.idDocumento'),
      field     : 'id_documento'
    },
    idComponente: {
      type      : DataTypes.UUID,
      allowNull : true,
      xlabel    : lang.t('fields.idComponente'),
      field     : 'id_componente'
    },
    envio: {
      type      : DataTypes.JSONB,
      allowNull : false,
      xlabel    : lang.t('fields.envio'),
      field     : 'envio'
    },
    respuesta: {
      type      : DataTypes.JSONB,
      allowNull : false,
      xlabel    : lang.t('fields.respuesta'),
      field     : 'respuesta'
    },
    respuestaFormateado: {
      type      : DataTypes.JSONB,
      allowNull : false,
      xlabel    : lang.t('fields.respuestaFormateado'),
      field     : 'respuesta_formateado'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestampsGestionDocumental(fields);

  const EjecucionInteroperabilidad = sequelize.define('ejecucion_interoperabilidad', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'gestion_ejecucion_interoperabilidad'
  });

  return EjecucionInteroperabilidad;
};
