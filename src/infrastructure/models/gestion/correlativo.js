'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id        : util.pk('id'),
    idEntidad : {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idEntidad'),
      field  : 'id_entidad'
    },
    idUnidadOrganizacional: {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idUnidadOrganizacional'),
      field  : 'id_unidad_organizacional'
    },
    idCategoria: {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idCategoria'),
      field  : 'id_categoria'
    },
    idFormulario: {
      type      : DataTypes.UUID,
      xlabel    : lang.t('fields.idFormulario'),
      allowNull : true,
      field     : 'id_formulario'
    },
    correlativo: {
      type   : DataTypes.INTEGER,
      xlabel : lang.t('fields.correlativo'),
      field  : 'correlativo'
    },
    gestion: {
      type   : DataTypes.INTEGER,
      xlabel : lang.t('fields.gestion'),
      field  : 'gestion'
    },
    estado: {
      type         : DataTypes.ENUM,
      values       : ['ACTIVO', 'INACTIVO'],
      defaultValue : 'ACTIVO',
      xlabel       : lang.t('fields.estado'),
      field        : 'estado'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestampsGestionDocumental(fields);

  const Correlativo = sequelize.define('correlativo', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'gestion_correlativo'
  });

  return Correlativo;
};
