'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id      : util.pk('id'),
    idFlujo : {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idFlujo'),
      field  : 'id_flujo'
    },
    idDocumento: {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idDocumento'),
      field  : 'id_documento'
    },
    usuarioInicial: {
      type      : DataTypes.UUID,
      allowNull : true,
      xlabel    : lang.t('fields.usuarioInicial'),
      field     : 'usuario_inicial'
    },
    usuarioFinal: {
      type      : DataTypes.UUID,
      allowNull : true,
      xlabel    : lang.t('fields.usuarioFinal'),
      field     : 'usuario_final'
    },
    accion: {
      type   : DataTypes.TEXT,
      xlabel : lang.t('fields.accion'),
      field  : 'accion'
    },
    descripcion: {
      type   : DataTypes.STRING(1024),
      xlabel : lang.t('fields.descripcion'),
      field  : 'descripcion'
    },
    numero: {
      type   : DataTypes.INTEGER,
      xlabel : lang.t('fields.numero'),
      field  : 'numero'
    },
    completada: {
      type         : DataTypes.BOOLEAN,
      xlabel       : lang.t('fields.estado'),
      field        : 'estado',
      defaultValue : false
    }
  };

  // Agregando campos para el log
  fields = util.setTimestampsGestionDocumental(fields);

  const Derivacion = sequelize.define('derivacion', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'gestion_derivacion'
  });

  return Derivacion;
};
