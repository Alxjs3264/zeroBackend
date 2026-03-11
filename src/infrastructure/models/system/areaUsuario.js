'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id        : util.pk('id'),
    idUsuario : {
      type      : DataTypes.UUID,
      allowNull : true,
      xlabel    : lang.t('fields.idUsuario'),
      field     : 'id_usuario'
    },
    idArea: {
      type      : DataTypes.UUID,
      allowNull : true,
      xlabel    : lang.t('fields.idArea'),
      field     : 'id_area'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const AreaUsuario = sequelize.define('area_usuario', fields, {
    paranoid   : false,
    timestamps : true,
    tableName  : 'sys_area_usuario'
  });

  return AreaUsuario;
};
