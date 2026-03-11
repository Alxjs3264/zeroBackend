'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id       : util.pk('id'),
    idFlujo  : {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idFlujo'),
      field  : 'id_flujo'
    },
    cite: {
      type      : DataTypes.STRING(255),
      xlabel    : lang.t('fields.cite'),
      allowNull : false,
      field     : 'cite',
    },
    remitenteDe: {
      type   : DataTypes.TEXT,
      xlabel : lang.t('fields.remitenteDe'),
      field  : 'remitente_de'
    },
    destinatarioPara: {
      type   : DataTypes.TEXT,
      xlabel : lang.t('fields.destinatarioPara'),
      field  : 'destinatario_para'
    },
    referenciaDocumento: {
      type   : DataTypes.TEXT,
      xlabel : lang.t('fields.referenciaDocumento'),
      field  : 'referencia_documento'
    },
    rutaDocumento: {
      type   : DataTypes.TEXT,
      xlabel : lang.t('fields.rutaDocumento'),
      field  : 'ruta_documento'
    },
    fechaEmitido: util.dateField('fechaEmitido', 'fecha_emitido', true),
    observacion: {
      type   : DataTypes.TEXT,
      xlabel : lang.t('fields.observacion'),
      field  : 'observacion'
    },
    etapaDocumento: {
      type   : DataTypes.TEXT,
      xlabel : lang.t('fields.etapaDocumento'),
      field  : 'etapa_documento'
    },
    estado: {
      type   : DataTypes.BOOLEAN,
      xlabel : lang.t('fields.estado'),
      field  : 'estado'
    },
  };

  // Agregando campos para el log
  fields = util.setTimestampsGestionDocumental(fields);

  const DocumentoExterno = sequelize.define('documento_externo', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'gestion_documento_externo'
  });

  return DocumentoExterno;
};
