'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id                   : util.pk('id'),
    idSolicitudPlantilla : {
      type      : DataTypes.UUID,
      xlabel    : lang.t('fields.idSolicitudPlantilla'),
      allowNull : true,
      field     : 'id_solicitud_plantilla'
    },
    idPasoActual: {
      type      : DataTypes.UUID,
      xlabel    : lang.t('fields.idPasoActual'),
      allowNull : true,
      field     : 'id_paso_actual'
    },
    codigoFlujo: {
      type   : DataTypes.STRING(250),
      xlabel : lang.t('fields.codigoFlujo'),
      field  : 'codigo_flujo'
    },
    tipo: {
      type         : DataTypes.ENUM,
      values       : ['GESTION', 'SIPFA'],
      defaultValue : 'GESTION',
      xlabel       : lang.t('fields.tipo'),
      field        : 'tipo'
    },
    tipoFlujo: {
      type         : DataTypes.ENUM,
      values       : ['INTERNO', 'EXTERNO'],
      defaultValue : 'INTERNO',
      xlabel       : lang.t('fields.tipoFlujo'),
      field        : 'tipo_flujo'
    },
    idFlujoPadre: {
      type      : DataTypes.UUID,
      xlabel    : lang.t('fields.idFlujoPadre'),
      allowNull : true,
      field     : 'id_flujo_padre'
    },
    estado: {
      type         : DataTypes.ENUM,
      values       : ['PENDIENTE', 'FINALIZADO', 'ARCHIVADO', 'CANCELADO', 'VINCULADO'],
      xlabel       : lang.t('fields.estado'),
      defaultValue : 'PENDIENTE',
      field        : 'estado'
    },
    clasificacion: {
      type         : DataTypes.ENUM,
      values       : ['CONFIDENCIAL', 'ABIERTO', 'RESERVADO'],
      xlabel       : lang.t('fields.clasificacion'),
      defaultValue : 'ABIERTO',
      field        : 'clasificacion'
    },
    historialClasificacion: {
      type         : DataTypes.JSONB,
      xlabel       : lang.t('fields.historialClasificacion'),
      defaultValue : [],
      allowNull    : false,
      field        : 'historial_clasificacion'
    },
    concluido: {
      type         : DataTypes.BOOLEAN,
      defaultValue : false,
      xlabel       : lang.t('fields.concluido'),
      field        : 'concluido'
    },
    idCarpeta: {
      type      : DataTypes.UUID,
      xlabel    : lang.t('fields.idCarpeta'),
      allowNull : true,
      field     : 'id_carpeta'
    },
    proveidoCierre: {
      type   : DataTypes.STRING(500),
      xlabel : lang.t('fields.proveidoCierre'),
      field  : 'proveido_cierre'
    },
    areaRemitente: {
      type   : DataTypes.STRING(500),
      xlabel : lang.t('fields.areaRemitente'),
      field  : 'area_remitente'
    },
    remitente: {
      type   : DataTypes.STRING(500),
      xlabel : lang.t('fields.remitente'),
      field  : 'remitente'
    },
    cargoRemitente: {
      type   : DataTypes.STRING(500),
      xlabel : lang.t('fields.cargoRemitente'),
      field  : 'cargo_remitente'
    },
    areaDestino: {
      type   : DataTypes.STRING(500),
      xlabel : lang.t('fields.areaDestino'),
      field  : 'area_destino'
    },
    areaDestinoId: {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.areaDestinoId'),
      field  : 'area_destino_id'
    },
    referencia: {
      type   : DataTypes.TEXT,
      xlabel : lang.t('fields.referencia'),
      field  : 'referencia'
    },
    migrado: {
      type         : DataTypes.BOOLEAN,
      defaultValue : false,
      allowNull    : false,
      xlabel       : lang.t('fields.migrado'),
      field        : 'migrado'
    },
    copia: {
      type         : DataTypes.BOOLEAN,
      defaultValue : false,
      allowNull    : false,
      xlabel       : lang.t('fields.copia'),
      field        : 'copia'
    },
    idFlujoOrigen: {
      type      : DataTypes.UUID,
      xlabel    : lang.t('fields.idFlujoOrigen'),
      allowNull : true,
      field     : 'id_flujo_origen'
    },
    idFlujoDestino: {
      type      : DataTypes.UUID,
      xlabel    : lang.t('fields.idFlujoDestino'),
      allowNull : true,
      field     : 'id_flujo_destino'
    },
    numeroHr: {
      type      : DataTypes.STRING(100),
      xlabel    : lang.t('fields.numeroHr'),
      allowNull : true,
      unique    : true,
      field     : 'numero_hr'
    },
    datosConsolidados: {
      type         : DataTypes.JSONB,
      allowNull    : false,
      defaultValue : {},
      xlabel       : lang.t('fields.datosConsolidados'),
      field        : 'datos_consolidados'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestampsGestionDocumental(fields);

  const FlujoDocumental = sequelize.define('flujo_documental', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'gestion_flujo_documental'
  });

  return FlujoDocumental;
};
