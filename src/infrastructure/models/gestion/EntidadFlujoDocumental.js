'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id        : util.pk('id'),
    idEntidad : {
      type      : DataTypes.UUID,
      xlabel    : lang.t('fields.idEntidad'),
      allowNull : false,
      field     : 'id_entidad'
    },
    idFlujoDocumental: {
      type      : DataTypes.UUID,
      xlabel    : lang.t('fields.idFlujoDocumental'),
      allowNull : false,
      field     : 'id_flujo_documental'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestampsGestionDocumental(fields);

  const EntidadFlujoDocumental = sequelize.define('entidad_flujo_documental', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'gestion_entidad_flujo_documental'
  });

  return EntidadFlujoDocumental;
};
