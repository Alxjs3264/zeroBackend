'use strict';

const lang = require('../../../lang');
const util = require('../../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id          : util.pk('id'),
    idOperacion : { // llave foranea de la tabla (Operacion)
      type      : DataTypes.UUID,
      allowNull : false,
      xlabel    : lang.t('fields.idOperacion'),
      field     : 'id_operacion'
    },
    idPartida: { // llave foranea de la tabla (partida_presupuestaria)
      type      : DataTypes.UUID,
      allowNull : false,
      xlabel    : lang.t('fields.idPartida'),
      field     : 'id_partida'
    },
    idEstado: { // llave foranea de la tabla (partida_presupuestaria)
      type      : DataTypes.UUID,
      allowNull : false,
      xlabel    : lang.t('fields.idEstado'),
      field     : 'id_estado'
    },
    idUnidadMedida: { // llave foranea de la tabla (unidad_medida)
      type      : DataTypes.UUID,
      allowNull : false,
      xlabel    : lang.t('fields.idUnidadMedida'),
      field     : 'id_unidad_medida'
    },
    descripcion: {
      type      : DataTypes.TEXT,
      allowNull : true,
      xlabel    : lang.t('fields.descripcion'),
      field     : 'descripcion'
    },
    cantidad: {
      type         : DataTypes.INTEGER,
      defaultValue : 0,
      xlabel       : lang.t('fields.cantidad'),
      field        : 'cantidad'
    },
    tiempo: {
      type         : DataTypes.INTEGER,
      defaultValue : 0,
      xlabel       : lang.t('fields.tiempo'),
      field        : 'tiempo'
    },
    precioUnitario: {
      type      : DataTypes.DECIMAL(10, 2),
      allowNull : false,
      xlabel    : lang.t('fields.precioUnitario'),
      field     : 'precio_unitario'
    },
    montoAprobado: {
      type      : DataTypes.DECIMAL(10, 2),
      allowNull : false,
      xlabel    : lang.t('fields.montoAprobado'),
      field     : 'monto_aprobado'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestampsGestionDocumental(fields);

  const BienServicioDemandado = sequelize.define('bien_servicio_demandado', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'planificacion_bien_servicio_demandado'
  });

  return BienServicioDemandado;
};
