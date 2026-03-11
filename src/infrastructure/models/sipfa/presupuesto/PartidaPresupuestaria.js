'use strict';

const lang = require('../../../lang');
const util = require('../../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id     : util.pk('id'),
    codigo : {
      type   : DataTypes.INTEGER,
      xlabel : lang.t('fields.codigo'),
      field  : 'codigo'
    },
    grupo: {
      type   : DataTypes.INTEGER,
      xlabel : lang.t('fields.grupo'),
      field  : 'grupo'
    },
    descripcion: {
      type   : DataTypes.STRING(200),
      xlabel : lang.t('fields.descripcion'),
      field  : 'descripcion'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestampsGestionDocumental(fields);

  const PartidaPresupuestaria = sequelize.define('partida_presupuestaria', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'presupuesto_partida_presupuestaria'
  });

  return PartidaPresupuestaria;
};
