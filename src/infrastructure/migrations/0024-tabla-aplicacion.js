'use strict';

const util = require('../lib/util');
const lang = require('../lang');

module.exports = {
  up: (queryInterface, Sequelize) => {
    let fields = {
      id        : util.pk('id'),
      idEntidad : {
        type      : Sequelize.DataTypes.UUID,
        allowNull : false,
        xlabel    : lang.t('fields.idEntidad'),
        field     : 'id_entidad'
      },
      idUsuario: {
        type      : Sequelize.DataTypes.UUID,
        allowNull : false,
        xlabel    : lang.t('fields.idUsuario'),
        field     : 'id_usuario'
      },
      nombre: {
        type      : Sequelize.DataTypes.STRING(50),
        allowNull : false,
        xlabel    : lang.t('fields.nombre')
      },
      descripcion: {
        type   : Sequelize.DataTypes.TEXT,
        xlabel : lang.t('fields.descripcion')
      },
      caducidad: {
        type   : Sequelize.DataTypes.INTEGER,
        xlabel : lang.t('fields.caducidad')
      },
      token: {
        type   : Sequelize.DataTypes.TEXT,
        xlabel : lang.t('fields.token')
      },
      estado: {
        type         : Sequelize.DataTypes.ENUM,
        values       : ['ACTIVO', 'INACTIVO'],
        allowNull    : false,
        defaultValue : 'ACTIVO',
        xlabel       : lang.t('fields.estado'),
        field        : 'estado'
      }
    };

    // Agregando campos para el log
    fields = util.setTimestamps(fields);

    return queryInterface.createTable('sys_aplicacion', fields, {
      paranoid   : true,
      timestamps : true,
      tableName  : 'sys_aplicacion'
    });
  }
};
