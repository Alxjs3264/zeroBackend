'use strict';

const debug = require('debug')('app:service:documentoService');
const moment = require('moment');
const log = require('log4js').getLogger();
const { ErrorApp } = require('../../lib/error');
const { rollbackYLimpiarArchivos, eliminarNoDefinidosONulos, documentoReducido } = require('../../lib/util');
const { renameKeys } = require('../../../common/lib/object');

module.exports = function flujoService (repositories, helpers, res) {
  const {
    DocumentoRepository,
    FlujoDocumentalRepository,
  } = repositories;

  async function historial (params) {
    let historial = await FlujoDocumentalRepository.historial(params);
    return historial;
  }

  async function categoriasFlujos () {
    return (await FlujoDocumentalRepository.categoriasFlujos());
  }

  return {
    historial,
    categoriasFlujos
  };
};
