'use strict';

const util = require('../lib/util');
const lang = require('../lang');

module.exports = {
  up: (queryInterface, Sequelize) => {
    let fields = {
      id          : util.pk('id'),
      idDocumento : {
        type      : Sequelize.DataTypes.UUID,
        allowNull : false,
        xlabel    : lang.t('fields.idDocumento'),
        field     : 'id_documento'
      },
      idUsuarioOrigen: {
        type      : Sequelize.DataTypes.UUID,
        allowNull : false,
        xlabel    : lang.t('fields.idUsuarioOrigen'),
        field     : 'id_usuario_origen'
      },
      idUsuario: {
        type      : Sequelize.DataTypes.UUID,
        allowNull : false,
        xlabel    : lang.t('fields.idUsuario'),
        field     : 'id_usuario'
      },
      visto: {
        type         : Sequelize.DataTypes.BOOLEAN,
        allowNull    : false,
        defaultValue : false,
        xlabel       : lang.t('fields.visto'),
        field        : 'visto'
      },
      fechaVisto: {
        type      : Sequelize.DataTypes.DATE,
        allowNull : true,
        xlabel    : lang.t('fields.fechaVisto'),
        field     : 'fecha_visto'
      },
      aprobado: {
        type         : Sequelize.DataTypes.BOOLEAN,
        allowNull    : false,
        defaultValue : false,
        xlabel       : lang.t('fields.aprobado'),
        field        : 'aprobado'
      },
      fechaAprobado: {
        type      : Sequelize.DataTypes.DATE,
        allowNull : true,
        xlabel    : lang.t('fields.fechaAprobado'),
        field     : 'fecha_aprobado'
      },
      tipo: {
        type         : Sequelize.DataTypes.ENUM,
        values       : ['LECTOR', 'COMENTADOR', 'EDITOR'],
        allowNull    : false,
        defaultValue : 'LECTOR',
        xlabel       : lang.t('fields.tipo'),
        field        : 'tipo'
      },
      comentarios: {
        type   : Sequelize.DataTypes.TEXT,
        xlabel : lang.t('fields.comentarios'),
        field  : 'comentarios'
      },
      detalle: {
        type      : Sequelize.DataTypes.JSONB,
        allowNull : false,
        xlabel    : lang.t('fields.detalle'),
        field     : 'detalle'
      }
    };

    // Agregando campos para el log
    fields = util.setTimestamps(fields);

    return queryInterface.createTable('gestion_documento_compartido', fields, {
      paranoid   : false,
      timestamps : false,
      tableName  : 'gestion_documento_compartido'
    });
  }
};
