'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id     : util.pk('id'),
    nombre : {
      type   : DataTypes.STRING(500),
      xlabel : lang.t('fields.nombre'),
      field  : 'nombre'
    },
    descripcion: {
      type   : DataTypes.TEXT,
      xlabel : lang.t('fields.descripcion'),
      field  : 'descripcion'
    },
    gestion: {
      type   : DataTypes.STRING(4),
      xlabel : lang.t('fields.gestion'),
      field  : 'gestion'
    },
    tipo: {
      type         : DataTypes.ENUM,
      values       : ['AREA', 'PERSONAL'],
      defaultValue : 'PERSONAL',
      xlabel       : lang.t('fields.tipo'),
      field        : 'tipo'
    },
    idAreaCreacion: {
      type      : DataTypes.UUID,
      allowNull : false,
      xlabel    : lang.t('fields.idAreaCreacion'),
      field     : 'id_area_creacion'
    },
    areasCompartidas: {
      type   : DataTypes.TEXT,
      xlabel : lang.t('fields.areasCompartidas'),
      field  : 'areas_compartidas'
    },
    usuariosCompartidos: {
      type   : DataTypes.TEXT,
      xlabel : lang.t('fields.usuariosCompartidos'),
      field  : 'usuarios_compartidos'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const Area = sequelize.define('carpeta', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'sys_carpeta'
  });

  return Area;
};
