'use strict';
const debug = require('debug')('app:controller:componente');
const log = require('log4js').getLogger();
const { Respuesta } = require('../../../lib/respuesta');
const { Finalizado, HttpCodes } = require('../../../lib/globals');

module.exports = function setupFlujoDocumentaleController (services) {
  const { FlujoService } = services;

  async function historial (req, res) {
    try {
      const respuesta = await FlujoService.historial(req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      log.error('Error obteniendo historial de flujo documental');
      log.error(error);
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function categoriasFlujos (req, res) {
    try {
      const respuesta = await FlujoService.categoriasFlujos();
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      log.error('Error obteniendo categorías de flujo documental');
      log.error(error);
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  return {
    historial,
    categoriasFlujos
  };
};
