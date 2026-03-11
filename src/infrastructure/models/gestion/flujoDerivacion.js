'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id      : util.pk('id'),
    idFlujo : {
      type      : DataTypes.UUID,
      xlabel    : lang.t('fields.idFlujo'),
      allowNull : true,
      field     : 'id_flujo'
    },
    idPaso: {
      type      : DataTypes.UUID,
      xlabel    : lang.t('fields.idPaso'),
      allowNull : true,
      field     : 'id_paso'
    },
    idDocumento: {
      type      : DataTypes.UUID,
      xlabel    : lang.t('fields.idDocumento'),
      allowNull : true,
      field     : 'id_documento'
    },
    idUsuarioRemitente: {
      type      : DataTypes.UUID,
      xlabel    : lang.t('fields.idUsuarioRemitente'),
      allowNull : true,
      field     : 'id_usuario_remitente'
    },
    nombreRemitente: {
      type      : DataTypes.STRING(200),
      xlabel    : lang.t('fields.nombreRemitente'),
      allowNull : true,
      field     : 'nombre_remitente'
    },
    cargoRemitente: {
      type   : DataTypes.STRING(250),
      xlabel : lang.t('fields.cargoRemitente'),
      field  : 'cargo_remitente'
    },
    idCargoRemitente: {
      type      : DataTypes.UUID,
      xlabel    : lang.t('fields.idCargoRemitente'),
      allowNull : true,
      field     : 'id_cargo_remitente'
    },
    idUsuarioDestinatario: {
      type      : DataTypes.UUID,
      xlabel    : lang.t('fields.idUsuarioDestinatario'),
      allowNull : true,
      field     : 'id_usuario_destinatario'
    },
    nombreDestinatario: {
      type      : DataTypes.STRING(200),
      xlabel    : lang.t('fields.nombreDestinatario'),
      allowNull : true,
      field     : 'nombre_destinatario'
    },
    cargoDestinatario: {
      type   : DataTypes.STRING(250),
      xlabel : lang.t('fields.cargoDestinatario'),
      field  : 'cargo_destinatario'
    },
    idCargoDestinatario: {
      type      : DataTypes.UUID,
      xlabel    : lang.t('fields.idCargoDestinatario'),
      allowNull : true,
      field     : 'id_cargo_destinatario'
    },
    idAccion: {
      type      : DataTypes.UUID,
      xlabel    : lang.t('fields.idAccion'),
      allowNull : true,
      field     : 'id_accion'
    },
    descripcion: {
      type   : DataTypes.TEXT,
      xlabel : lang.t('fields.descripcion'),
      field  : 'descripcion'
    },
    fechaRecepcion: {
      type   : DataTypes.DATE,
      xlabel : lang.t('fields.fechaRecepcion'),
      field  : 'fecha_recepcion',
      get    : function () {
        if (this.getDataValue('fechaRecepcion')) {
          return moment(this.getDataValue('fechaRecepcion')).format('DD-MM-YYYY HH:mm:ss');
        }
        return null;
      }
    },
    fechaDerivacion: {
      type   : DataTypes.DATE,
      xlabel : lang.t('fields.fechaDerivacion'),
      field  : 'fecha_derivacion',
      get    : function () {
        if (this.getDataValue('fechaDerivacion')) {
          return moment(this.getDataValue('fechaDerivacion')).format('DD-MM-YYYY HH:mm:ss');
        }
        return null;
      }
    },
    observacion: {
      type         : DataTypes.BOOLEAN,
      allowNull    : false,
      defaultValue : false,
      xlabel       : lang.t('fields.observacion'),
      field        : 'observacion'
    },
    urgente: {
      type         : DataTypes.BOOLEAN,
      allowNull    : false,
      defaultValue : false,
      xlabel       : lang.t('fields.urgente'),
      field        : 'urgente'
    },
    fechaPlazo: {
      type         : DataTypes.DATEONLY,
      allowNull    : true,
      defaultValue : null,
      xlabel       : lang.t('fields.fechaPlazo'),
      field        : 'fecha_plazo',
      get          : function () {
        if (this.getDataValue('fechaPlazo')) {
          return moment(this.getDataValue('fechaPlazo')).format('DD-MM-YYYY');
        }
        return null;
      }
    },
    tipo: {
      type         : DataTypes.ENUM,
      values       : ['REMITENTE', 'VIA', 'DESTINATARIO', 'PROVEIDO', 'VINCULADO', 'ARCHIVADO', 'RECUPERADO'],
      xlabel       : lang.t('fields.tipo'),
      defaultValue : 'REMITENTE',
      allowNull    : true,
      field        : 'tipo'
    },
    estado: {
      type         : DataTypes.ENUM,
      values       : ['INICIO', 'RECIBIDO', 'PENDIENTE DE FIRMA', 'DERIVADO'],
      xlabel       : lang.t('fields.estado'),
      defaultValue : 'INICIO',
      field        : 'estado'
    },
    estadoActual: {
      type      : DataTypes.ENUM,
      values    : ['ACTIVO', 'INACTIVO'],
      xlabel    : lang.t('fields.estadoActual'),
      allowNull : true,
      field     : 'estado_actual'
    },
    etapa: {
      type         : DataTypes.ENUM,
      values       : ['INICIO', 'PROCESO', 'FIN'],
      allowNull    : false,
      defaultValue : 'PROCESO',
      xlabel       : lang.t('fields.etapa'),
      field        : 'etapa'
    },
    // copia: {
    //   type         : DataTypes.BOOLEAN,
    //   allowNull    : false,
    //   defaultValue : false,
    //   xlabel       : lang.t('fields.copia'),
    //   field        : 'copia'
    // },
    informacionComplementaria: {
      type         : DataTypes.JSONB,
      defaultValue : null,
      allowNull    : true,
      xlabel       : lang.t('fields.informacionComplementaria'),
      field        : 'informacion_complementaria'
    },
    esObservable: {
      type         : DataTypes.BOOLEAN,
      allowNull    : false,
      defaultValue : true,
      xlabel       : lang.t('fields.esObservable'),
      field        : 'es_observable'
    }

  };

  // Agregando campos para el log
  fields = util.setTimestampsGestionDocumental(fields);

  const flujoDerivacion = sequelize.define('flujo_derivacion', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'gestion_flujo_derivacion'
  });

  return flujoDerivacion;
};
