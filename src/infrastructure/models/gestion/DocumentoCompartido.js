'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id          : util.pk('id'),
    idDocumento : {
      type      : DataTypes.UUID,
      allowNull : false,
      xlabel    : lang.t('fields.idDocumento'),
      field     : 'id_documento'
    },
    idUsuarioOrigen: {
      type      : DataTypes.UUID,
      allowNull : false,
      xlabel    : lang.t('fields.idUsuarioOrigen'),
      field     : 'id_usuario_origen'
    },
    idUsuario: {
      type      : DataTypes.UUID,
      allowNull : false,
      xlabel    : lang.t('fields.idUsuario'),
      field     : 'id_usuario'
    },
    visto: {
      type         : DataTypes.BOOLEAN,
      allowNull    : false,
      defaultValue : false,
      xlabel       : lang.t('fields.visto'),
      field        : 'visto'
    },
    fechaVisto: {
      type      : DataTypes.DATE,
      allowNull : true,
      xlabel    : lang.t('fields.fechaVisto'),
      field     : 'fecha_visto',
      get       : function () {
        if (this.getDataValue('fechaVisto')) {
          return moment(this.getDataValue('fechaVisto')).format('DD-MM-YYYY HH:mm:ss');
        }
        return null;
      }
    },
    aprobado: {
      type         : DataTypes.BOOLEAN,
      allowNull    : false,
      defaultValue : false,
      xlabel       : lang.t('fields.aprobado'),
      field        : 'aprobado'
    },
    fechaAprobado: {
      type      : DataTypes.DATE,
      allowNull : true,
      xlabel    : lang.t('fields.fechaAprobado'),
      field     : 'fecha_aprobado',
      get       : function () {
        if (this.getDataValue('fechaAprobado')) {
          return moment(this.getDataValue('fechaAprobado')).format('DD-MM-YYYY HH:mm:ss');
        }
        return null;
      }
    },
    tipo: {
      type         : DataTypes.ENUM,
      values       : ['LECTOR', 'COMENTADOR', 'EDITOR'],
      allowNull    : false,
      defaultValue : 'LECTOR',
      xlabel       : lang.t('fields.tipo'),
      field        : 'tipo'
    },
    comentarios: {
      type   : DataTypes.TEXT,
      xlabel : lang.t('fields.comentarios'),
      field  : 'comentarios'
    },
    detalle: {
      type      : DataTypes.JSONB,
      allowNull : false,
      xlabel    : lang.t('fields.detalle'),
      field     : 'detalle'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestampsGestionDocumental(fields);

  const DocumentoCompartido = sequelize.define('documento_compartido', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'gestion_documento_compartido'
  });

  return DocumentoCompartido;
};
