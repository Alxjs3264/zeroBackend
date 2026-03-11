'use strict';

const util = require('../lib/util');
const lang = require('../lang');

module.exports = {
  up: (queryInterface, Sequelize) => {
    let fields = {
      id        : util.pk('id'),
      idUsuario : {
        type      : Sequelize.DataTypes.UUID,
        allowNull : false,
        xlabel    : lang.t('fields.idUsuario'),
        field     : 'id_usuario'
      },
      motivo: {
        type         : Sequelize.DataTypes.TEXT,
        allowNull    : false,
        defaultValue : '',
        xlabel       : lang.t('fields.motivo'),
        field        : 'motivo'
      },
      lunes: {
        type         : Sequelize.DataTypes.JSONB,
        allowNull    : true,
        defaultValue : null,
        xlabel       : lang.t('fields.lunes'),
        field        : 'lunes'
      },
      martes: {
        type         : Sequelize.DataTypes.JSONB,
        allowNull    : true,
        defaultValue : null,
        xlabel       : lang.t('fields.martes'),
        field        : 'martes'
      },
      miercoles: {
        type         : Sequelize.DataTypes.JSONB,
        allowNull    : true,
        defaultValue : null,
        xlabel       : lang.t('fields.miercoles'),
        field        : 'miercoles'
      },
      jueves: {
        type         : Sequelize.DataTypes.JSONB,
        allowNull    : true,
        defaultValue : null,
        xlabel       : lang.t('fields.jueves'),
        field        : 'jueves'
      },
      viernes: {
        type         : Sequelize.DataTypes.JSONB,
        allowNull    : true,
        defaultValue : null,
        xlabel       : lang.t('fields.viernes'),
        field        : 'viernes'
      },
      sabado: {
        type         : Sequelize.DataTypes.JSONB,
        allowNull    : true,
        defaultValue : null,
        xlabel       : lang.t('fields.sabado'),
        field        : 'sabado'
      },
      domingo: {
        type         : Sequelize.DataTypes.JSONB,
        allowNull    : true,
        defaultValue : null,
        xlabel       : lang.t('fields.domingo'),
        field        : 'domingo'
      }
    };

    // Agregando campos para el log
    fields = util.setTimestamps(fields);

    return queryInterface.createTable('sys_historial_horarios', fields, {
      paranoid   : false,
      timestamps : false,
      tableName  : 'sys_historial_horarios'
    });
  }
};
