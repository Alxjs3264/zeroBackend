'use strict';

const lang = require('../../../lang');
const util = require('../../../lib/util');
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id                     : util.pk('id'),
    idUnidadOrganizacional : { // llave foranea de la tabla (unidad_organizacional)
      type      : DataTypes.UUID,
      allowNull : false,
      xlabel    : lang.t('fields.idUnidadOrganizacional'),
      field     : 'id_unidad_organizacional'
    },
    idEstructura: { // llave foranea de la tabla (estructura)
      type      : DataTypes.UUID,
      allowNull : false,
      xlabel    : lang.t('fields.idEstructura'),
      field     : 'id_estructura'
    },
    idTipoFormulacion: { // llave foranea de la tabla (tipo_formulacion)
      type      : DataTypes.UUID,
      allowNull : false,
      xlabel    : lang.t('fields.idTipoFormulacion'),
      field     : 'id_tipo_formulacion'
    },
    idUnidadOrganizacionalRevisora: { // llave foranea de la tabla (unidad_organizacional)
      type      : DataTypes.UUID,
      allowNull : false,
      xlabel    : lang.t('fields.idUnidadOrganizacionalRevisora'),
      field     : 'id_unidad_organizacional_revisora'
    },
    idUsuarioRevisor: { // llave foranea de la tabla (usuario)
      type      : DataTypes.UUID,
      allowNull : false,
      xlabel    : lang.t('fields.idUsuarioRevisor'),
      field     : 'id_usuario_revisor'
    },
    idUsuarioValidador: { // llave foranea de la tabla (usuario)
      type      : DataTypes.UUID,
      allowNull : false,
      xlabel    : lang.t('fields.idUsuarioValidador'),
      field     : 'id_usuario_validador'
    },
    validado: {
      type      : DataTypes.BOOLEAN,
      allowNull : false,
      xlabel    : lang.t('fields.validado'),
      field     : 'validado'
    },
    fechaRevision: {
      type   : DataTypes.DATE,
      xlabel : lang.t('fields.fechaRevision'),
      field  : 'fecha_revision',
      set    : function (value) {
        const fechaParseada = moment(value).format('YYYY-MM-DD HH:mm:ss');
        this.setDataValue('fechaRevision', fechaParseada);
      },
      get: function () {
        if (this.getDataValue('fechaRevision')) {
          return moment(this.getDataValue('fechaRevision')).format('DD-MM-YYYY');
        }
        return null;
      }
    },
    fechaValidacion: {
      type   : DataTypes.DATE,
      xlabel : lang.t('fields.fechaValidacion'),
      field  : 'fecha_validacion',
      set    : function (value) {
        const fechaParseada = moment(value).format('YYYY-MM-DD HH:mm:ss');
        this.setDataValue('fechaValidacion', fechaParseada);
      },
      get: function () {
        if (this.getDataValue('fechaValidacion')) {
          return moment(this.getDataValue('fechaValidacion')).format('DD-MM-YYYY');
        }
        return null;
      }
    },
    observacion: {
      type      : DataTypes.TEXT,
      allowNull : true,
      xlabel    : lang.t('fields.observacion'),
      field     : 'observacion'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestampsGestionDocumental(fields);

  const Formulacion = sequelize.define('formulacion', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'planificacion_formulacion'
  });

  return Formulacion;
};
