'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id                   : util.pk('id'),
    idSolicitudPlantilla : {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idSolicitudPlantilla'),
      field  : 'id_solicitud_plantilla'
    },
    nombrePaso: {
      type   : DataTypes.STRING(500),
      xlabel : lang.t('fields.nombrePaso'),
      field  : 'nombre_paso'
    },
    tipo: {
      type   : DataTypes.STRING(30),
      xlabel : lang.t('fields.tipo'),
      field  : 'tipo'
    },
    idEntidad: {
      type      : DataTypes.UUID,
      allowNull : true,
      xlabel    : lang.t('fields.idEntidad'),
      field     : 'id_entidad'
    },
    idFormulario: {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idFormulario'),
      field  : 'id_formulario'
    },

    idTipoCargo: {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idTipoCargo'),
      field  : 'id_tipo_cargo'
    },
    proveidoDefecto: {
      type   : DataTypes.TEXT,
      xlabel : lang.t('fields.proveidoDefecto'),
      field  : 'proveido_defecto'
    },
    tipoFinalizacion: {
      type   : DataTypes.STRING(50),
      xlabel : lang.t('fields.tipoFinalizacion'),
      field  : 'tipo_finalizacion'
    },
    dependenciaFuncional: {
      type   : DataTypes.STRING(50),
      xlabel : lang.t('fields.dependenciaFuncional'),
      field  : 'dependencia_funcional'
    },
    configuracionCargo: {
      type   : DataTypes.JSONB,
      xlabel : lang.t('fields.configuracionCargo'),
      field  : 'configuracion_cargo'
    },
    configuracion: {
      type   : DataTypes.JSONB,
      xlabel : lang.t('fields.configuracion'),
      field  : 'configuracion'
    },
    mostrarEntidad: {
      type         : DataTypes.BOOLEAN,
      allowNull    : false,
      defaultValue : false,
      xlabel       : lang.t('fields.mostrarEntidad'),
      field        : 'mostrar_entidad'
    },
    // PARA SITPRECO
    multiplesFormularios: {
      type         : DataTypes.BOOLEAN,
      allowNull    : false,
      defaultValue : false,
      xlabel       : lang.t('fields.multiplesFormularios'),
      field        : 'multiples_formularios'
    },
    listaFormularios: {
      type         : DataTypes.JSONB,
      allowNull    : true,
      defaultValue : [],
      xlabel       : lang.t('fields.listaFormularios'),
      field        : 'lista_formularios'
    },
    campo: {
      type         : DataTypes.JSONB,
      allowNull    : true,
      defaultValue : null,
      xlabel       : lang.t('fields.campo'),
      field        : 'campo'
    },
    recuperarDocumento: {
      type         : DataTypes.BOOLEAN,
      allowNull    : false,
      defaultValue : false,
      xlabel       : lang.t('fields.recuperarDocumento'),
      field        : 'recuperar_documento'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const Paso = sequelize.define('paso', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'bpm_paso'
  });

  return Paso;
};
