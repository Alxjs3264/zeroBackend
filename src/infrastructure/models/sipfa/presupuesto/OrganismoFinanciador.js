'use strict';
const lang = require('../../../lang');
const util = require('../../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id     : util.pk('id'),
    codigo : {
      type   : DataTypes.STRING(100),
      xlabel : lang.t('fields.codigo'),
      field  : 'codigo'
    },
    sigla: {
      type   : DataTypes.STRING(15),
      xlabel : lang.t('fields.sigla'),
      field  : 'sigla'
    },
    fuente: {
      type   : DataTypes.STRING(100),
      xlabel : lang.t('fields.fuente'),
      field  : 'fuente'
    },
    organismo: {
      type   : DataTypes.STRING(200),
      xlabel : lang.t('fields.organismo'),
      field  : 'organismo'
    },
    descripcion: {
      type   : DataTypes.STRING(200),
      xlabel : lang.t('fields.descripcion'),
      field  : 'descripcion'
    }

  };

  // Agregando campos para el log
  fields = util.setTimestampsGestionDocumental(fields);

  const OrganismoFinanciador = sequelize.define('organismo_financiador', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'presupuesto_organismo_financiador'
  });

  return OrganismoFinanciador;
};
