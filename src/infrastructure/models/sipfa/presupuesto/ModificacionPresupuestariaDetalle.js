'use strict';

const lang = require('../../../lang');
const util = require('../../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id     : util.pk('id'),
    idModificacionPresupuestaria: {
      type      : DataTypes.UUID,
      allowNull : true,
      xlabel    : lang.t('fields.idModificacionPresupuestaria'),
      field     : 'id_modificacion_presupuestaria'
    },
    idPresupuesto: {
        type      : DataTypes.UUID,
        allowNull : true,
        xlabel    : lang.t('fields.idPresupuesto'),
        field     : 'id_presupuesto'
    },
    monto : {
        type      : DataTypes.DECIMAL (10, 2),
        allowNull : false,
        xlabel    : lang.t('fields.monto'),
        field     : 'monto'
    },
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const ModificacionPresupuestariaDetalle = sequelize.define('modificacion_presupuestaria_detalle', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'presupuesto_modificacion_presupuestaria_detalle'
  });

  return ModificacionPresupuestariaDetalle;
};
