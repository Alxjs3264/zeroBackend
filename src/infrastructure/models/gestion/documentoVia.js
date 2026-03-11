'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id: util.pk('id'),
    idDocumento: {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idDocumento'),
      field  : 'id_documento'
    },
    idUsuario: {
      type   : DataTypes.UUID,
      xlabel : lang.t('fields.idUsuario'),
      field  : 'id_usuario'
    },
    tipo: {
      type   : DataTypes.ENUM({
        values: [
          /* Significa que el usuario puede ver y hacer observaciones pero no es necesario que
             de el visto bueno */
          'CON COPIA',

          /* Significa que el usuario via debe dar el visto bueno al documento para que 
             el destinatario pueda ver el documento en su bandeja.
           */
          'VISTO BUENO REQUERIDO',
        ]
      }),
      xlabel : lang.t('fields.tipo'),
      field  : 'tipo'
    },
    comentario: {
      type   : DataTypes.TEXT,
      xlabel : lang.t('fields.comentario'),
      field  : 'comentario'
    },
    vistoBueno: {
      type         : DataTypes.BOOLEAN,
      xlabel       : lang.t('fields.vistoBueno'),
      defaultValue : false,
      field        : 'visto_bueno'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestampsGestionDocumental(fields);

  const DocumentoVia = sequelize.define('documentoVia', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'gestion_documento_via'
  });

  return DocumentoVia;
};
