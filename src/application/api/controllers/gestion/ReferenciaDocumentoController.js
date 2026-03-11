
'use strict';
const debug = require('debug')('app:controller:REFERENCIA_DOCUMENTO');
const { Respuesta } = require('../../../lib/respuesta');
const log = require('log4js').getLogger();
const { Finalizado, HttpCodes } = require('../../../lib/globals');

module.exports = function setupRolController (services) {
  const {
    ReferenciaDocumentoService
  } = services;

  async function listar (req, res) {
    try {
      debug('Recuperando Referencia Documento');
      const respuesta = await ReferenciaDocumentoService.findAll(req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function crear (req, res) {
    try {
      const data = req.body;
      debug('Creando Referencia Documento');
      data.userCreated = req.user.idUsuario;
      const respuesta = await ReferenciaDocumentoService.createOrUpdate(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function actualizar (req, res) {
    try {
      debug('Actualizando Referencia Documento');
      const data = req.body;
      data.id = req.params.id;
      data.userUpdated = req.user.idUsuario;
      const respuesta = await ReferenciaDocumentoService.createOrUpdate(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      log.error(error);
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function eliminar (req, res) {
    try {
      const { id } = req.params;
      debug('Eliminando Referencia Documento');
      const respuesta = await ReferenciaDocumentoService.deleteItem(id);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  return {
    listar,
    crear,
    actualizar,
    eliminar
  };
};
