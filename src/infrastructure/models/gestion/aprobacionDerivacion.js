'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id : util.pk('id'),
    idFlujo : {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idFlujo'),
      field  : 'id_flujo'
    },
    idDerivacion: {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idDerivacion'),
      field  : 'id_derivacion'
    },
    usuarioInicial: {
      type      : DataTypes.UUID,
      allowNull : true,
      xlabel    : lang.t('fields.usuarioInicial'),
      field     : 'usuario_inicial'
    },
    usuarioAprobador: {
      type      : DataTypes.UUID,
      allowNull : true,
      xlabel    : lang.t('fields.usuarioAprobador'),
      field     : 'usuario_aprobador'
    },
    vistoBueno: {
      type   : DataTypes.BOOLEAN,
      xlabel : lang.t('fields.vistoBueno'),
      field  : 'visto_bueno'
    },
    observacion: {
      type   : DataTypes.STRING(1024),
      xlabel : lang.t('fields.observacion'),
      field  : 'observacion'
    },
    estado: {
      type   : DataTypes.BOOLEAN,
      xlabel : lang.t('fields.estado'),
      field  : 'estado'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestampsGestionDocumental(fields);

  const AprobacionDerivacion = sequelize.define('aprobacion_derivacion', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'gestion_aprobacion_derivacion'
  });

  return AprobacionDerivacion;
};
