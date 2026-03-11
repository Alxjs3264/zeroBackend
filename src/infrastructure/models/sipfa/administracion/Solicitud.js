'use strict';

const lang = require('../../../lang');
const util = require('../../../lib/util');
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id        : util.pk('id'),
    idGestion : { // llave foranea de la tabla (gestion)
      type      : DataTypes.UUID,
      allowNull : false,
      xlabel    : lang.t('fields.idGestion'),
      field     : 'id_gestion'
    },
    idPasoActual: { // llave foranea de la tabla (paso)
      type      : DataTypes.UUID,
      allowNull : false,
      xlabel    : lang.t('fields.idPasoActual'),
      field     : 'id_paso_actual'
    },
    parTipoSolicitud: { // llave foranea de la tabla (parametro)
      type      : DataTypes.UUID,
      allowNull : false,
      xlabel    : lang.t('fields.parTipoSolicitud'),
      field     : 'par_tipo_solicitud'
    },
    // parTipoContratacion: { // llave foranea de la tabla (parametro)
    //   type      : DataTypes.UUID,
    //   allowNull : false,
    //   xlabel    : lang.t('fields.parTipoContratacion'),
    //   field     : 'par_tipo_contratacion'
    // },
    // parTipoAdjudicacion: { // llave foranea de la tabla (parametro)
    //   type      : DataTypes.UUID,
    //   allowNull : false,
    //   xlabel    : lang.t('fields.parTipoAdjudicacion'),
    //   field     : 'par_tipo_adjudicacion'
    // },
    parTipoPlanilla: { // llave foranea de la tabla (parametro)
      type      : DataTypes.UUID,
      allowNull : true,
      xlabel    : lang.t('fields.parTipoPlanilla'),
      field     : 'par_tipo_planilla'
    },
    idUnidadOrganizacional: { // llave foranea de la tabla (unidad_organizacional)
      type      : DataTypes.UUID,
      allowNull : true,
      xlabel    : lang.t('fields.idUnidadOrganizacional'),
      field     : 'id_unidad_organizacional'
    },
    // hojaRuta: {
    //   type      : DataTypes.STRING(200),
    //   allowNull : true,
    //   xlabel    : lang.t('fields.hojaRuta'),
    //   field     : 'hoja_ruta'
    // },
    objetivo: {
      type      : DataTypes.TEXT,
      allowNull : false,
      xlabel    : lang.t('fields.objetivo'),
      field     : 'objetivo'
    },
    justificacion: {
      type      : DataTypes.TEXT,
      allowNull : true,
      xlabel    : lang.t('fields.justificacion'),
      field     : 'justificacion'
    },
    // numeroDocumento: {
    //   type      : DataTypes.STRING(200),
    //   allowNull : true,
    //   xlabel    : lang.t('fields.numeroDocumento'),
    //   field     : 'numero_documento'
    // },
    fechaRecepcion: {
      type   : DataTypes.DATE,
      xlabel : lang.t('fields.fechaRecepcion'),
      field  : 'fecha_recepcion',
      set    : function (value) {
        const fechaParseada = moment(value).format('YYYY-MM-DD HH:mm:ss');
        this.setDataValue('fechaRecepcion', fechaParseada);
      },
      get: function () {
        if (this.getDataValue('fechaRecepcion')) {
          return moment(this.getDataValue('fechaRecepcion')).format('DD-MM-YYYY');
        }
        return null;
      }
    },
    // correlativoUnicoCompraEstado: {
    //   type      : DataTypes.STRING(200),
    //   allowNull : true,
    //   xlabel    : lang.t('fields.correlativoUnicoCompraEstado'),
    //   field     : 'correlativo_unico_compra_estado'
    // },
    estado: {
      type   : DataTypes.ENUM,
      values : ['ACTIVO', 'INACTIVO'],
      xlabel : lang.t('fields.estado'),
      field  : 'estado'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const Solicitud = sequelize.define('solicitud', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'administracion_solicitud'
  });

  return Solicitud;
};
