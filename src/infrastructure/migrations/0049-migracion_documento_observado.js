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
        field     : 'id_documento',
        references: {
          model: 'gestion_documento',
          key: 'id'
        },
      },
      idUsuarioObservacion: {
        type      : Sequelize.DataTypes.UUID,
        allowNull : false,
        xlabel    : lang.t('fields.idUsuarioObservacion'),
        field     : 'id_usuario_onservacion',
        references: {
          model: 'sys_usuario',
          key: 'id'
        },
      },
      idDerivacionOrigen: {
        type      : Sequelize.DataTypes.UUID,
        allowNull : false,
        xlabel    : lang.t('fields.idDerivacionOrigen'),
        field     : 'id_derivacion_origen',
        references: {
          model: 'gestion_flujo_derivacion',
          key: 'id'
        },
      },
      plantillaObservada: {
        type   : Sequelize.DataTypes.JSONB,
        xlabel : lang.t('fields.plantillaObservada'),
        field  : 'plantilla_observada'
      },
      observacion: {
        type   : Sequelize.DataTypes.TEXT,
        xlabel : lang.t('fields.observacion'),
        field  : 'observacion'
      },
      fechaObservacion: {
        type      : Sequelize.DataTypes.DATE,
        allowNull : true,
        xlabel    : lang.t('fields.fechaObservacion'),
        field     : 'fecha_observacion'
      },
      corregido: {
        type         : Sequelize.DataTypes.BOOLEAN,
        allowNull    : false,
        defaultValue : false,
        xlabel       : lang.t('fields.corregido'),
        field        : 'corregido'
      },
      fechaCorreccion: {
        type          : Sequelize.DataTypes.DATE,
        allowNull     : true,
        defaultValue  : null,
        xlabel        : lang.t('fields.fechaCorreccion'),
        field         : 'fecha_correccion'
      },
    };

    // Agregando campos para el log
    fields = util.setTimestamps(fields);

    return queryInterface.createTable('gestion_documento_observacion', fields, {
      paranoid   : false,
      timestamps : false,
      tableName  : 'gestion_documento_observacion'
    });
  }
};
