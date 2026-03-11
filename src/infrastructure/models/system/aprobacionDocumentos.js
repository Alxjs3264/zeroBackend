'use strict';

const util = require('../../lib/util');
const lang = require('../../lang');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id        : util.pk('id'),
    idUsuario : {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idUsuario'),
      field  : 'id_usuario'
    },
    idFlujo: {
      type      : DataTypes.UUID,
      allowNull : true,
      xlabel    : lang.t('fields.idFlujo'),
      field     : 'id_flujo'
    },
    idDocumento: {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idDocumento'),
      field  : 'id_documento'
    },
    tramite: {
      type         : DataTypes.UUID,
      defaultValue : DataTypes.UUIDV4,
      xlabel       : lang.t('fields.tramite'),
      field        : 'tramite'
    },
    urlRedireccion: {
      type      : DataTypes.TEXT,
      xlabel    : lang.t('fields.urlRedireccion'),
      field     : 'url_redireccion',
      allowNull : false
    },
    aceptado: {
      type         : DataTypes.BOOLEAN,
      xlabel       : lang.t('fields.aceptado'),
      field        : 'aceptado',
      defaultValue : false
    },
    introducido: {
      type         : DataTypes.BOOLEAN,
      xlabel       : lang.t('fields.introducido'),
      field        : 'introducido',
      defaultValue : false
    },
    codigoOperacion: {
      type      : DataTypes.TEXT,
      xlabel    : lang.t('fields.codigo_operacion'),
      field     : 'codigo_operacion',
      allowNull : true
    },
    transactionId: {
      type      : DataTypes.TEXT,
      xlabel    : lang.t('fields.transactionId'),
      field     : 'transaction_id',
      allowNull : true
    },
    fechaHoraSolicitud: {
      type   : DataTypes.TEXT,
      xlabel : lang.t('fields.fechaHoraSolicitud'),
      field  : 'fecha_hora_solicitud'
    },
    hashDatos: {
      type   : DataTypes.TEXT,
      xlabel : lang.t('fields.hasDatos'),
      field  : 'hash_datos'
    },
    ci: {
      type   : DataTypes.TEXT,
      xlabel : lang.t('fields.ci'),
      field  : 'ci'
    },
    descripcion: {
      type   : DataTypes.TEXT,
      xlabel : lang.t('fields.descripcion'),
      field  : 'descripcion'
    },
    nombreArchivo: {
      type   : DataTypes.TEXT,
      xlabel : lang.t('fields.nombreArchivo'),
      field  : 'nombre_archivo'
    },
    urlRedireccionCliente: {
      type      : DataTypes.TEXT,
      allowNull : true,
      xlabel    : lang.t('fields.urlRedireccionCliente'),
      field     : 'url_redireccion_cliente'
    },
    accion: {
      type: DataTypes.ENUM({
        values: ['CERRAR', 'DERIVAR', 'ARCHIVAR']
      }),
      allowNull    : true,
      defaultValue : 'CERRAR',
      xlabel       : lang.t('fields.accion'),
      field        : 'accion'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const aprobacionDocumentos = sequelize.define('aprobacion_documentos', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'sys_aprobacion_documentos'
  });

  return aprobacionDocumentos;
};
