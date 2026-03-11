'use strict';

const lang = require('../../../lang');
const util = require('../../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id        : util.pk('id'),
    parTipoServicio : { // llave foranea de la tabla (parametro)
      type      : DataTypes.UUID,
      allowNull : false,
      xlabel    : lang.t('fields.parTipoServicio'),
      field     : 'par_tipo_servicio'
    },
    descripcion: {
      type      : DataTypes.TEXT,
      allowNull : true,
      xlabel    : lang.t('fields.descripcion'),
      field     : 'descripcion'
    },
    nit: {
      type      : DataTypes.STRING(200),
      allowNull : true,
      xlabel    : lang.t('nit'),
      field     : 'nit'
    },
    direccion: {
      type      : DataTypes.STRING(200),
      allowNull : true,
      xlabel    : lang.t('direccion'),
      field     : 'direccion'
    },
    correoElectronico: {
      type      : DataTypes.STRING(200),
      allowNull : true,
      xlabel    : lang.t('correoElectronico'),
      field     : 'correo_electronico'
    },
    representanteLegal: {
      type      : DataTypes.STRING(200),
      allowNull : true,
      xlabel    : lang.t('representanteLegal'),
      field     : 'representante_legal'
    },
    representanteLegalCI: {
      type      : DataTypes.STRING(200),
      allowNull : true,
      xlabel    : lang.t('representanteLegalCI'),
      field     : 'representante_legal_ci'
    },
    bancoNumeroCuenta: {
      type      : DataTypes.TEXT,
      allowNull : true,
      xlabel    : lang.t('fields.bancoNumeroCuenta'),
      field     : 'banco_numero_cuenta'
    },
    estado: {
      type   : DataTypes.ENUM,
      values : ['ACTIVO', 'INACTIVO'],
      xlabel : lang.t('fields.estado'),
      field  : 'estado'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const Proveedor = sequelize.define('proveedor', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'administracion_proveedor'
  });

  return Proveedor;
};
