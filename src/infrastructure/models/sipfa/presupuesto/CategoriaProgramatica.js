'use strict';

const lang = require('../../../lang');
const util = require('../../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id       : util.pk('id'),
    programa : {
      type   : DataTypes.INTEGER,
      xlabel : lang.t('fields.programa'),
      field  : 'programa'
    },
    proyecto: {
      type   : DataTypes.INTEGER,
      xlabel : lang.t('fields.proyecto'),
      field  : 'proyecto'
    },
    actividad: {
      type   : DataTypes.INTEGER,
      xlabel : lang.t('fields.actividad'),
      field  : 'actividad'
    },
    descripcion: {
      type   : DataTypes.STRING(200),
      xlabel : lang.t('fields.descripcion'),
      field  : 'descripcion'
    },
    idCategoriaProgramatica: {
      allowNull : true,
      type      : DataTypes.UUID,
      xlabel    : lang.t('fields.idCategoriaProgramatica'),
      field     : 'id_categoria_programatica'
    },
    estado: {
      type         : DataTypes.ENUM,
      values       : ['ACTIVO', 'INACTIVO'],
      defaultvalue : 'ACTIVO',
      xlabel       : lang.t('fields.estado'),
      field        : 'estado'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestampsGestionDocumental(fields);

  const CategoriaProgramatica = sequelize.define('categoria_programatica', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'presupuesto_categoria_programatica'
  });

  return CategoriaProgramatica;
};
