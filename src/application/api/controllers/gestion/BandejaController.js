'use strict';
const debug = require('debug')('app:controller:componente');
const log = require('log4js').getLogger();
const { Respuesta } = require('../../../lib/respuesta');
const { Finalizado, HttpCodes } = require('../../../lib/globals');

module.exports = function setupComponenteController (services) {
  const { BandejaService } = services;

  async function bandeja (req, res) {
    try {
      const respuesta = await BandejaService.bandeja(req.user, req.query.tipo || '');
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      log.error('Error obteniendo bandeja para usuario');
      log.error(req.user);
      log.error(error);
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  return {
    bandeja,
  };
};
