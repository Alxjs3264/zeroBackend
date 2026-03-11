
'use strict';
const debug = require('debug')('app:controller:formulario');
const { Respuesta } = require('../../../lib/respuesta');
const { Finalizado, HttpCodes } = require('../../../lib/globals');
const { app } = require('../../../../common/config');

module.exports = function setupSolicitudPlantillaController (services) {
  const { DocumentoCompartidoService } = services;

  async function findAll (req, res) {
    try {
      const respuesta = await DocumentoCompartidoService.findAll(req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta, null, req, services));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function findOne (req, res) {
    try {
      const data = req.body;
      data.id = req.params.id;
      const respuesta = await DocumentoCompartidoService.findOne(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta, null, req, services));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function createItem (req, res) {
    try {
      const data = req.body;
      data.userCreated = req.user.idUsuario;
      const respuesta = await DocumentoCompartidoService.createOrUpdate(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta, null, req, services));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function updateItem (req, res) {
    try {
      const data = req.body;
      debug('actualizando formulario');
      data.id = req.params.id;
      data.userUpdated = req.user.idUsuario;
      const respuesta = await DocumentoCompartidoService.crearOActualizar(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta, null, req, services));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function deleteItem (req, res) {
    try {
      const { id } = req.params;
      debug('Eliminando formulario');
      const respuesta = await DocumentoCompartidoService.deleteItemCond({ id });
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta, null, req, services));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function visto (req, res) {
    try {
      const data = {
        id          : req.params.id,
        visto       : true,
        fechaVisto  : new Date(),
        userUpdated : req.user.idUsuario
      };
      const respuesta = await DocumentoCompartidoService.crearOActualizar(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta, null, req, services));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function aprobado (req, res) {
    try {
      const data = {
        id            : req.params.id,
        aprobado      : true,
        fechaAprobado : new Date(),
        userUpdated   : req.user.idUsuario
      };
      const respuesta = await DocumentoCompartidoService.crearOActualizar(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta, null, req, services));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  return {
    visto,
    aprobado,
    findAll,
    findOne,
    createItem,
    updateItem,
    deleteItem
  };
};
