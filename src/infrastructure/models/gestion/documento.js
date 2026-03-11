'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');
const moment = require('moment');
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id      : util.pk('id'),
    idFlujo : {
      type      : DataTypes.UUID,
      xlabel    : lang.t('fields.idFlujo'),
      allowNull : true,
      field     : 'id_flujo'
    },
    idDocumentoPadre: {
      type      : DataTypes.UUID,
      xlabel    : lang.t('fields.idDocumentoPadre'),
      field     : 'id_documento_padre',
      allowNull : true
    },
    configuracionDerivaciones: {
      type   : DataTypes.JSONB,
      xlabel : lang.t('fields.configuracionDerivaciones'),
      field  : 'configuracion_derivaciones'
    },
    hojaRuta: {
      type      : DataTypes.STRING(250),
      allowNull : true,
      xlabel    : lang.t('fields.hojaRuta'),
      field     : 'hoja_ruta'
    },
    cite: {
      type   : DataTypes.STRING(250),
      xlabel : lang.t('fields.cite'),
      field  : 'cite'
    },
    asunto: {
      type   : DataTypes.TEXT,
      xlabel : lang.t('fields.asunto'),
      field  : 'asunto'
    },
    plantilla: {
      type   : DataTypes.JSONB,
      xlabel : lang.t('fields.plantilla'),
      field  : 'plantilla'
    },
    plantillaValor: {
      type   : DataTypes.JSONB,
      xlabel : lang.t('fields.plantillaValor'),
      field  : 'plantilla_valor'
    },
    clasificacion: {
      type      : DataTypes.ENUM,
      values    : ['CLASIFICADO', 'ABIERTO', 'SOLO PARA REFERENCIAR'],
      xlabel    : lang.t('fields.clasificacion'),
      field     : 'clasificacion',
      allowNull : true
    },
    firmado: {
      type         : DataTypes.BOOLEAN,
      xlabel       : lang.t('fields.firmado'),
      field        : 'firmado',
      defaultValue : false
    },
    referenciaDocumento: {
      type   : DataTypes.JSONB,
      xlabel : lang.t('fields.referenciaDocumento'),
      field  : 'referencia_documento'
    },
    configuracionFinalizacion: {
      type   : DataTypes.JSONB,
      xlabel : lang.t('fields.configuracionFinalizacion'),
      field  : 'configuracion_finalizacion'
    },
    fechaDocumento: {
      type         : DataTypes.DATEONLY,
      xlabel       : lang.t('fields.fechaDocumento'),
      field        : 'fecha_documento',
      allowNull    : false,
      defaultValue : Sequelize.NOW,
      get          : function () {
        if (this.getDataValue('fechaDocumento')) {
          return moment(this.getDataValue('fechaDocumento')).format('DD-MM-YYYY');
        }
        return null;
      }
    },
    fechaCerrado: {
      type   : DataTypes.DATE,
      xlabel : lang.t('fields.fechaCerrado'),
      field  : 'fecha_cerrado',
      get    : function () {
        if (this.getDataValue('fechaCerrado')) {
          return moment(this.getDataValue('fechaCerrado')).format('DD-MM-YYYY HH:mm:ss');
        }
        return null;
      }
    },
    estado: {
      type         : DataTypes.ENUM,
      values       : ['BORRADOR', 'PENDIENTE FIRMA', 'NUEVO', 'EN REVISIÓN', 'REQUIERE RESPUESTA', 'PROCESADO', 'DERIVADO', 'DESPACHADO', 'CERRADO', 'ARCHIVADO', 'CANCELADO', 'OBSERVADO', 'EN CORRECCION'],
      xlabel       : lang.t('fields.estado'),
      field        : 'estado',
      defaultValue : 'BORRADOR'
    },
    nombrePdf: {
      type      : DataTypes.STRING(300),
      xlabel    : lang.t('fields.nombrePdf'),
      allowNull : true,
      field     : 'nombre_pdf'
    },
    linkFirma: {
      type      : DataTypes.STRING(1000),
      xlabel    : lang.t('fields.linkFirma'),
      allowNull : true,
      field     : 'link_firma'
    },
    editable: {
      type         : DataTypes.BOOLEAN,
      allowNull    : false,
      defaultValue : true,
      xlabel       : lang.t('fields.editable'),
      field        : 'editable'
    },
    compartido: {
      type         : DataTypes.BOOLEAN,
      allowNull    : false,
      defaultValue : false,
      xlabel       : lang.t('fields.compartido'),
      field        : 'compartido'
    },
    idDocumentoOriginal: {
      type         : DataTypes.UUID,
      allowNull    : true,
      defaultValue : null,
      xlabel       : lang.t('fields.idDocumentoOriginal'),
      field        : 'id_documento_original'
    },
    palabrasClave: {
      type         : DataTypes.TEXT,
      allowNull    : true,
      defaultValue : null,
      xlabel       : lang.t('fields.palabrasClave'),
      field        : 'palabras_clave',
      set          : function (value) {
        if (value) this.setDataValue('palabrasClave', value.join(',') || null);
        if (!value) this.setDataValue('palabrasClave', null);
      },
      get: function () {
        if (this.getDataValue('palabrasClave')) {
          return this.getDataValue('palabrasClave').split(',');
        }
        return null;
      }
    },
    docconfidencial: {
      type         : DataTypes.BOOLEAN,
      defaultValue : false,
      xlabel       : lang.t('fields.docconfidencial'),
      field        : 'docconfidencial'
    },
    pathDocumentoFirma: {
      type         : DataTypes.TEXT,
      allowNull    : true,
      defaultValue : null,
      xlabel       : lang.t('fields.docconfidencial'),
      field        : 'path_documento_firma'
    },
    remitenteDe: {
      type      : DataTypes.UUID,
      xlabel    : lang.t('fields.remitenteDe'),
      field     : 'remitenteDe',
      allowNull : true
    },
    destinatarioArea: {
      type      : DataTypes.UUID,
      xlabel    : lang.t('fields.destinatarioArea'),
      field     : 'destinatarioArea',
      allowNull : true
    },
    destinatarioEspecifico: {
      type      : DataTypes.UUID,
      xlabel    : lang.t('fields.destinatarioEspecifico'),
      field     : 'destinatarioEspecifico',
      allowNull : true
    },
    plantillaPdf: {
      type         : DataTypes.BOOLEAN,
      defaultValue : false,
      xlabel       : lang.t('fields.plantillaPdf'),
      field        : 'plantilla_pdf'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestampsGestionDocumental(fields);

  const Documento = sequelize.define('documento', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'gestion_documento'
  });

  return Documento;
};
