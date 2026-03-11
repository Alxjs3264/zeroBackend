'use strict';

const lang = require('../../../lang');
const util = require('../../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id       : util.pk('id'),
    idPuesto : {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idPuesto'),
      field  : 'id_puesto'
    },
    vigente: {
      type   : DataTypes.BOOLEAN,
      xlabel : lang.t('fields.vigente'),
      field  : 'vigente'
    },
    datosPersonales: {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.datosPersonales'),
      field  : 'datos_personales'
    },
    fechaIngreso: {
      type   : DataTypes.DATEONLY,
      xlabel : lang.t('fields.fechaIngreso'),
      field  : 'fecha_ingreso'
    },
    fechaSalida: {
      type   : DataTypes.DATEONLY,
      xlabel : lang.t('fields.fechaSalida'),
      field  : 'fecha_salida'
    }
  };
  // Agregando campos para el log
  fields = util.setTimestampsGestionDocumental(fields);

  const PuestoDatosPersonales = sequelize.define('puesto_datos_personales', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'planificacion_puesto_datos_personales'
  });

  return PuestoDatosPersonales;
};
