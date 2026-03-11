'use strict';

const lang = require('../../../lang');
const util = require('../../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id              : util.pk('id'),
    idEstructuraPoa : {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idEstructuraPoa'),
      field  : 'id_estructura_poa'
    },
    idUnidadOrganizacional: {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idUnidadOrganizacional'),
      field  : 'id_unidad_organizacional'
    },
    idCategoriaProgramatica: {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idCategoriaProgramatica'),
      field  : 'id_categoria_programatica'
    },
    idOrganismoFinanciador: {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idOrganismoFinanciador'),
      field  : 'id_organismo_financiador'
    },
    monto: {
      type   : DataTypes.FLOAT,
      xlabel : lang.t('fields.monto'),
      field  : 'monto'
    }

  };

  // Agregando campos para el log
  fields = util.setTimestampsGestionDocumental(fields);

  const TechoPresupuestario = sequelize.define('techo_presupuestario', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'presupuesto_techo_presupuestario'
  });

  return TechoPresupuestario;
};
