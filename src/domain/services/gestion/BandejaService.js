'use strict';
const debug = require('debug')('app:service:formulario');
const log = require('log4js').getLogger();
const { ErrorApp } = require('../../lib/error');
const { documentoReducido } = require('../../lib/util');

module.exports = function bandejaService (repositories, helpers, res) {
  const { DocumentoRepository, UsuarioRepository, RolRepository } = repositories;

  return {
  };
};
