'use strict';

const util = require('../lib/util');
const lang = require('../lang');

module.exports = {
  up: (queryInterface, Sequelize) => {
    let fields = {
      id     : util.pk('id'),
      idPaso : {
        type      : Sequelize.DataTypes.UUID,
        allowNull : false,
        xlabel    : lang.t('fields.idPaso'),
        field     : 'id_paso'
      },
      idFlujo: {
        type      : Sequelize.DataTypes.UUID,
        allowNull : false,
        xlabel    : lang.t('fields.idFlujo'),
        field     : 'id_flujo'
      },
      idDocumento: {
        type      : Sequelize.DataTypes.UUID,
        allowNull : false,
        xlabel    : lang.t('fields.idDocumento'),
        field     : 'id_documento'
      },
      envio: {
        type      : Sequelize.DataTypes.JSONB,
        allowNull : false,
        xlabel    : lang.t('fields.envio'),
        field     : 'envio'
      },
      respuesta: {
        type      : Sequelize.DataTypes.JSONB,
        allowNull : false,
        xlabel    : lang.t('fields.respuesta'),
        field     : 'respuesta'
      },
      respuestaFormateado: {
        type      : Sequelize.DataTypes.JSONB,
        allowNull : false,
        xlabel    : lang.t('fields.respuestaFormateado'),
        field     : 'respuesta_formateado'
      }
    };

    // Agregando campos para el log
    fields = util.setTimestamps(fields);

    return queryInterface.createTable('gestion_ejecucion_interoperabilidad', fields, {
      paranoid   : false,
      timestamps : false,
      tableName  : 'gestion_ejecucion_interoperabilidad'
    });
  }
};
