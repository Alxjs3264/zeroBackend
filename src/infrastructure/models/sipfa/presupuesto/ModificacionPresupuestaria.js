'use strict';

const lang = require('../../../lang');
const util = require('../../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id        : util.pk('id'),
    idGestion : {
      type      : DataTypes.UUID,
      allowNull : true,
      xlabel    : lang.t('fields.idGestion'),
      field     : 'id_gestion'
    },
    idCategoriaProgramatica: {
      type      : DataTypes.UUID,
      allowNull : true,
      xlabel    : lang.t('fields.idCategoriaProgramatica'),
      field     : 'id_categoria_programatica'
    },
    idOrganismoFinanciador: {
      type      : DataTypes.UUID,
      allowNull : true,
      xlabel    : lang.t('fields.idOrganismoFinanciador'),
      field     : 'id_organismo_financiador'
    },
    descripcion: {
      type   : DataTypes.STRING(50),
      xlabel : lang.t('fields.descripcion'),
      field  : 'descripcion'
    },
    aprobacionFecha: {
      type         : DataTypes.DATE,
      defaultValue : 0,
      xlabel       : lang.t('fields.aprobacionFecha'),
      field        : 'aprobacion_fecha'
    },
    tipoAccion: {
      type   : DataTypes.ENUM,
      values : ['MODIFICACION', 'TRASPASO'],
      xlabel : lang.t('fields.tipoAccion'),
      field  : 'tipo_accion'
    },
    estado: {
      type   : DataTypes.ENUM,
      values : ['ACTIVO', 'INACTIVO'],
      xlabel : lang.t('fields.estado'),
      field  : 'estado'
    },
    monto: {
      type      : DataTypes.DECIMAL(10, 2),
      allowNull : false,
      xlabel    : lang.t('fields.monto'),
      field     : 'monto'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const ModificacionPresupuestaria = sequelize.define('modificacion_presupuestaria', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'presupuesto_modificacion_presupuestaria'
  });

  return ModificacionPresupuestaria;
};
