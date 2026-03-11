'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id          : util.pk('id'),
    idDocumento : {
      type      : DataTypes.UUID,
      xlabel    : lang.t('fields.idDocumento'),
      allowNull : true,
      field     : 'id_documento'
    },
    ruta: {
      type   : DataTypes.STRING(2000),
      xlabel : lang.t('fields.ruta'),
      field  : 'ruta'
    },
    nombre: {
      type   : DataTypes.TEXT,
      xlabel : lang.t('fields.nombre'),
      field  : 'nombre'
    },
    extension: {
      type   : DataTypes.STRING(20),
      xlabel : lang.t('fields.extension'),
      field  : 'extension'
    },
    editable: {
      type         : DataTypes.BOOLEAN,
      allowNull    : false,
      defaultValue : false,
      xlabel       : lang.t('fields.editable'),
      field        : 'editable'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestampsGestionDocumental(fields);

  const Firma = sequelize.define('archivo_adjunto', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'gestion_archivo_adjunto'
  });

  return Firma;
};
