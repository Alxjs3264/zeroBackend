'use strict';

const lang = require('../../../lang');
const util = require('../../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id              : util.pk('id'),
    idSolicitudPaso : { // llave foranea de la tabla (solicitud_paso)
      type      : DataTypes.UUID,
      allowNull : false,
      xlabel    : lang.t('fields.idSolicitudPaso'),
      field     : 'id_solicitud_paso'
    },
    urlAdjunto: {
      type      : DataTypes.STRING(200),
      allowNull : true,
      xlabel    : lang.t('fields.urlAdjunto'),
      field     : 'url_adjunto'
    },
    descripcion: {
      type      : DataTypes.TEXT,
      allowNull : true,
      xlabel    : lang.t('fields.descripcion'),
      field     : 'descripcion'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const Adjunto = sequelize.define('adjunto', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'administracion_adjunto'
  });

  return Adjunto;
};
