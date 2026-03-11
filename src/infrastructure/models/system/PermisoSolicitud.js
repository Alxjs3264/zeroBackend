'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id        : util.pk('id'),
    idEntidad : {
      type      : DataTypes.UUID,
      allowNull : true,
      xlabel    : lang.t('fields.idEntidad'),
      field     : 'id_entidad'
    },
    idArea: {
      type      : DataTypes.UUID,
      allowNull : true,
      xlabel    : lang.t('fields.idArea'),
      field     : 'id_area'
    },
    idSolicitudPlantilla: {
      type      : DataTypes.UUID,
      allowNull : false,
      xlabel    : lang.t('fields.idSolicitudPlantilla'),
      field     : 'id_solicitud_plantilla'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const RolPermiso = sequelize.define('sys_permisos_solicitud', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'sys_permisos_solicitud'
  });

  return RolPermiso;
};
