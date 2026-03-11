'use strict';

const debug = require('debug')('app:service:rol');
const { ErrorApp } = require('../../lib/error');

module.exports = function ReporteService (repositories, helpers, res) {
  const { ReporteRepository } = repositories;

  async function reporteGeneral (params = {}) {
    debug('listar api token endpoints');
    let respuesta;
    try {
      respuesta = await ReporteRepository.reporteGeneral(params);
      return respuesta;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function reporteSolvencias (params) {
    try {
      debug(params);
      const documentos = await ReporteRepository.reporteSolvencias(params);
      return documentos;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  return {
    reporteSolvencias,
    reporteGeneral
  };
};
