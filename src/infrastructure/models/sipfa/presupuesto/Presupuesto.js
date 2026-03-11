'use strict';

const lang = require('../../../lang');
const util = require('../../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id          : util.pk('id'),
    idOperacion : {
      type      : DataTypes.UUID,
      allowNull : true,
      xlabel    : lang.t('fields.idOperacion'),
      field     : 'id_operacion'
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
    idPartidaPresupuestaria: {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idPartidaPresupuestaria'),
      field  : 'id_partida_presupuestaria'
    },
    idUnidadMedida: {
      allowNull : true,
      type      : DataTypes.UUID,
      xlabel    : lang.t('fields.idUnidadMedida'),
      field     : 'id_unidad_medida'
    },
    descripcion: {
      allowNull : true,
      type      : DataTypes.STRING(200),
      xlabel    : lang.t('fields.descripcion'),
      field     : 'descripcion'
    },
    cantidad: {
      allowNull : true,
      type      : DataTypes.INTEGER,
      xlabel    : lang.t('fields.cantidad'),
      field     : 'cantidad'
    },
    tiempo: {
      allowNull : true,
      type      : DataTypes.INTEGER,
      xlabel    : lang.t('fields.tiempo'),
      field     : 'tiempo'
    },
    precioUnitario: {
      allowNull : true,
      type      : DataTypes.FLOAT,
      xlabel    : lang.t('fields.precioUnitario'),
      field     : 'precio_unitario'
    },
    montoAprobado: {
      type   : DataTypes.FLOAT,
      xlabel : lang.t('fields.montoAprobado'),
      field  : 'monto_aprobado'
    }

  };

  // Agregando campos para el log
  fields = util.setTimestampsGestionDocumental(fields);

  const Presupuesto = sequelize.define('presupuesto', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'presupuesto_presupuesto'
  });

  return Presupuesto;
};
