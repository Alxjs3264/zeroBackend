'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id          : util.pk('id'),
    idDocumento : {
      type      : DataTypes.UUID,
      allowNull : false,
      xlabel    : lang.t('fields.idDocumento'),
      field     : 'id_documento'
    },
    idUsuarioRevisor: {
      type      : DataTypes.UUID,
      allowNull : false,
      xlabel    : lang.t('fields.idUsuarioRevisor'),
      field     : 'id_usuario_revisor'
    },
    idUsuarioObservado: {
      type      : DataTypes.UUID,
      allowNull : false,
      xlabel    : lang.t('fields.idUsuarioObservado'),
      field     : 'id_usuario_observado'
    },
    idDerivacionOrigen: {
      type      : DataTypes.UUID,
      allowNull : false,
      xlabel    : lang.t('fields.idDerivacionOrigen'),
      field     : 'id_derivacion_origen'
    },
    plantillaObservada: {
      type   : DataTypes.JSONB,
      xlabel : lang.t('fields.plantillaObservada'),
      field  : 'plantilla_observada'
    },
    observacion: {
      type   : DataTypes.TEXT,
      xlabel : lang.t('fields.observacion'),
      field  : 'observacion'
    },
    fechaObservacion: {
      type      : DataTypes.DATE,
      allowNull : true,
      xlabel    : lang.t('fields.fechaObservacion'),
      field     : 'fecha_observacion',
      get       : function () {
        if (this.getDataValue('fechaObservacion')) {
          return moment(this.getDataValue('fechaObservacion')).format('DD-MM-YYYY HH:mm:ss');
        }
        return null;
      }
    },
    corregido: {
      type         : DataTypes.BOOLEAN,
      allowNull    : false,
      defaultValue : false,
      xlabel       : lang.t('fields.corregido'),
      field        : 'corregido'
    },
    fechaCorreccion: {
      type      : DataTypes.DATE,
      allowNull : true,
      defaultValue : null,
      xlabel    : lang.t('fields.fechaCorreccion'),
      field     : 'fecha_correccion',
      get       : function () {
        if (this.getDataValue('fechaCorreccion')) {
          return moment(this.getDataValue('fechaCorreccion')).format('DD-MM-YYYY HH:mm:ss');
        }
        return null;
      }
    },
  };

  // Agregando campos para el log
  fields = util.setTimestampsGestionDocumental(fields);

  const DocumentoObservacion = sequelize.define('documento_compartido', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'gestion_documento_observacion'
  });

  return DocumentoObservacion;
};