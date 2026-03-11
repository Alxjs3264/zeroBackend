'use strict';

const util = require('../lib/util');
const lang = require('../lang');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('ALTER TYPE enum_gestion_documento_estado ADD VALUE IF NOT EXISTS \'INVALIDO\'');
  },
  down: (queryInterface, Sequelize) => {
    // Si necesitas deshacer esta migración, puedes agregar una consulta SQL aquí.
  }
};
