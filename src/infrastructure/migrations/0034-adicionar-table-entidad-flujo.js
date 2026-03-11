'use strict';

const util = require('../lib/util');
const lang = require('../lang');

module.exports = {
  up: (queryInterface, Sequelize) => {
    let fields = {
      id        : util.pk('id'),
      idEntidad : {
        type      : Sequelize.UUID,
        xlabel    : lang.t('fields.idEntidad'),
        allowNull : false,
        field     : 'id_entidad'
      },
      idFlujoDocumental: {
        type      : Sequelize.UUID,
        xlabel    : lang.t('fields.idFlujoDocumental'),
        allowNull : false,
        field     : 'id_flujo_documental'
      }
    };

    // Agregando campos para el log
    fields = util.setTimestamps(fields);

    return queryInterface.createTable('gestion_entidad_flujo_documental', fields, {
      paranoid   : true,
      timestamps : true,
      tableName  : 'gestion_entidad_flujo_documental'
    });
  }
};
