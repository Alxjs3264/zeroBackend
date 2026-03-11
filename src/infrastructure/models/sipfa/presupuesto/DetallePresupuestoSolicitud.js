'use strict';

const lang = require('../../../lang');
const util = require('../../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id          : util.pk('id'),
    idSolicitud : {
      type      : DataTypes.UUID,
      allowNull : true,
      xlabel    : lang.t('fields.idSolicitud'),
      field     : 'id_solicitud'
    },
    idPresupuesto: {
      type      : DataTypes.UUID,
      allowNull : true,
      xlabel    : lang.t('fields.idPresupuesto'),
      field     : 'id_presupuesto'
    },
    idUnidadMedida: {
      type      : DataTypes.UUID,
      allowNull : true,
      xlabel    : lang.t('fields.idUnidadMedida'),
      field     : 'id_unidad_medida'
    },
    idProveedor: {
      type      : DataTypes.UUID,
      allowNull : true,
      xlabel    : lang.t('fields.idProveedor'),
      field     : 'id_proveedor'
    },
    descripcion: {
      type      : DataTypes.TEXT,
      allowNull : true,
      xlabel    : lang.t('fields.descripcion'),
      field     : 'descripcion'
    },
    imputacion: {
      type   : DataTypes.BOOLEAN,
      xlabel : lang.t('fields.imputacion'),
      field  : 'imputacion'
    },
    cantidad: {
      type         : DataTypes.INTEGER,
      defaultValue : 0,
      xlabel       : lang.t('fields.cantidad'),
      field        : 'cantidad'
    },
    precioUnitario: {
      type      : DataTypes.DECIMAL(10, 2),
      allowNull : false,
      xlabel    : lang.t('fields.precioUnitario'),
      field     : 'precio_unitario'
    },
    montoSolicitado: {
      type      : DataTypes.DECIMAL(10, 2),
      allowNull : false,
      xlabel    : lang.t('fields.montoSolicitado'),
      field     : 'monto_solicitado'
    },
    montoCertificado: {
      type      : DataTypes.DECIMAL(10, 2),
      allowNull : true,
      xlabel    : lang.t('fields.montoCertificado'),
      field     : 'monto_certificado'
    },
    montoPreventivo: {
      type      : DataTypes.DECIMAL(10, 2),
      allowNull : false,
      xlabel    : lang.t('fields.montoPreventivo'),
      field     : 'monto_preventivo'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const DetallePresupuestoSolicitud = sequelize.define('detalle_presupuesto_solicitud', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'presupuesto_detalle_presupuesto_solicitud'
  });

  return DetallePresupuestoSolicitud;
};
