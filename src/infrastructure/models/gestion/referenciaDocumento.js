'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id          : util.pk('id'),
    idDocumento : {
      type      : DataTypes.UUID,
      xlabel    : lang.t('fields.idDocumento'),
      allowNull : true,
      field     : 'id_documento'
    },
    idDocumentoReferenciado: {
      type      : DataTypes.UUID,
      xlabel    : lang.t('fields.idDocumentoReferenciado'),
      allowNull : true,
      field     : 'id_documento_referenciado'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestampsGestionDocumental(fields);

  const Firma = sequelize.define('referencia_documento', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'gestion_referencia_documento'
  });

  return Firma;
};
