
'use strict';
const debug = require('debug')('app:controller:REPORTE');
const { Respuesta } = require('../../../lib/respuesta');
const log = require('log4js').getLogger();
const { Finalizado, HttpCodes } = require('../../../lib/globals');

module.exports = function setupApitokenEndpointController (services) {
  const {
    ApitokenEndpointService
  } = services;

  async function listar (req, res) {
    try {
      debug('Recuperando apitoken endpoints');
      const respuesta = await ApitokenEndpointService.findAll(req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta.rows));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function crear (req, res) {
    try {
      const data = req.body;
      debug('creando apitoken endpoints');
      data.userCreated = req.user.idUsuario;
      const respuesta = await ApitokenEndpointService.createOrUpdate(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  return {
    crear,
    listar,
  };
};
