'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id        : util.pk('id'),
    idEntidad : { // llave foranea de la tabla (gestion)
      type         : DataTypes.UUID,
      allowNull    : true,
      defaultValue : null,
      xlabel       : lang.t('fields.idEntidad'),
      field        : 'id_entidad'
    },
    idAreas: { // llave foranea de la tabla (gestion)
      type         : DataTypes.TEXT,
      allowNull    : true,
      defaultValue : null,
      xlabel       : lang.t('fields.idAreas'),
      field        : 'id_areas',
      set          : function (value) {
        if (value) this.setDataValue('idAreas', value.join(',') || null);
        if (!value) this.setDataValue('idAreas', null);
      },
      get: function () {
        if (this.getDataValue('idAreas')) {
          return this.getDataValue('idAreas').split(',');
        }
        return null;
      }
    },
    nombre: {
      type      : DataTypes.STRING(150),
      allowNull : false,
      xlabel    : lang.t('fields.nombre'),
      field     : 'nombre'
    },
    descripcion: {
      type   : DataTypes.STRING(500),
      xlabel : lang.t('fields.descripcion'),
      field  : 'descripcion'
    },
    codigo: {
      type      : DataTypes.STRING(50),
      allowNull : true,
      xlabel    : lang.t('fields.codigo'),
      field     : 'codigo'
    },
    configuracion: {
      type         : DataTypes.JSONB,
      allowNull    : false,
      defaultValue : {},
      xlabel       : lang.t('fields.configuracion'),
      field        : 'configuracion'
    },
    instancias: {
      type         : DataTypes.INTEGER,
      allowNull    : false,
      dafaultvalue : 9999,
      xlabel       : lang.t('fields.instancias'),
      field        : 'instancias'
    },
    estado: {
      type         : DataTypes.ENUM,
      values       : ['ACTIVO', 'INACTIVO'],
      defaultValue : 'ACTIVO',
      allowNull    : false,
      xlabel       : lang.t('fields.estado'),
      field        : 'estado'
    },
    docfisico: {
      type         : DataTypes.BOOLEAN,
      defaultValue : false,
      xlabel       : lang.t('fields.docfisico'),
      field        : 'docfisico'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const SolicitudPlantilla = sequelize.define('solicitud_plantilla', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'bpm_solicitud_plantilla'
  });

  return SolicitudPlantilla;
};
