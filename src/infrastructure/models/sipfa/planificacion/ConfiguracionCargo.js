'use strict';

const lang = require('../../../lang');
const util = require('../../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id      : util.pk('id'),
    idCargo : {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idCargo'),
      field  : 'id_cargo'
    },
    idDepenenciaLinea: {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idDepenenciaLinea'),
      field  : 'id_dependencia_linea'
    },
    idDependenciaFuncional: {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idDependenciaFuncional'),
      field  : 'id_dependencia_funcional'
    },
    idDependenciaFormulario: {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idDependenciaFormulario'),
      field  : 'id_dependencia_formulario'
    },
    idDependenciaPoai: {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idDependenciaPoai'),
      field  : 'id_dependencia_poai'
    },
    idApruebaViaje: {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idApruebaViaje'),
      field  : 'id_aprueba_viaje'
    },
    idElaboraMemorandumViaje: {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idElaboraMemorandumViaje'),
      field  : 'id_elabora_memorandum_viaje'
    },
    idUnidadOrganizacional: {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idUnidadOrganizacional'),
      field  : 'id_unidad_organizacional'
    }
  };
  // Agregando campos para el log
  fields = util.setTimestampsGestionDocumental(fields);

  const ConfiguracionCargo = sequelize.define('configuracion_cargo', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'planificacion_configuracion_cargo'
  });

  return ConfiguracionCargo;
};
