'use strict';

const util = require('../lib/util');
const lang = require('../lang');

module.exports = {
  up: (queryInterface, Sequelize) => {
    let fields = {
      id           : util.pk('id'),
      idAplicacion : {
        type      : Sequelize.DataTypes.UUID,
        allowNull : true,
        xlabel    : lang.t('fields.idAplicacion'),
        field     : 'id_aplicacion'
      },
      idPermiso: {
        type      : Sequelize.DataTypes.UUID,
        allowNull : false,
        xlabel    : lang.t('fields.idPermiso'),
        field     : 'id_permiso'
      }
    };

    // Agregando campos para el log
    fields = util.setTimestamps(fields);

    return queryInterface.createTable('sys_aplicacion_permiso', fields, {
      paranoid   : true,
      timestamps : true,
      tableName  : 'sys_aplicacion_permiso'
    });
  }
};
