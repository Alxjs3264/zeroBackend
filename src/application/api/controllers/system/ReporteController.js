
'use strict';
const { Respuesta } = require('../../../lib/respuesta');
const { Finalizado, HttpCodes } = require('../../../lib/globals');

module.exports = function setupApitokenEndpointController (services) {
  const { ReporteService } = services;

  async function reporteGeneral (req, res) {
    try {
      const respuesta = await ReporteService.reporteGeneral(req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function reporteSolvencias (req, res) {
    try {
      const respuesta = await ReporteService.reporteSolvencias(req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  return {
    reporteSolvencias,
    reporteGeneral
  };
};
