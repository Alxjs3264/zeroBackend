'use strict';

const util = require('../lib/util');
const lang = require('../lang');

module.exports = {
  up: (queryInterface, Sequelize) => {
    let fields = {
      id             : util.pk('id'),
      nombreCompleto : {
        type      : Sequelize.STRING(100),
        allowNull : false,
        xlabel    : lang.t('fields.nombreCompleto'),
        field     : 'nombre_completo'
      },
      cargo: {
        type      : Sequelize.STRING(100),
        allowNull : true,
        xlabel    : lang.t('fields.cargo')
      },
      procedencia: {
        type      : Sequelize.STRING(100),
        allowNull : true,
        xlabel    : lang.t('fields.procedencia')
      },
      estado: {
        type   : Sequelize.ENUM,
        values : ['ACTIVO', 'INACTIVO'],
        xlabel : lang.t('fields.estado'),
        field  : 'estado'
      }
    };

    // Agregando campos para el log
    fields = util.setTimestamps(fields);

    return queryInterface.createTable('gestion_usuario_externo', fields, {
      paranoid   : false,
      timestamps : false,
      tableName  : 'gestion_usuario_externo'
    });
  }
};
