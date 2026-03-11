'use strict';

const debug = require('debug')('app:controller:auth');
const { Respuesta } = require('../../../../lib/respuesta');
const { Finalizado, HttpCodes } = require('../../../../lib/globals');

module.exports = function setupSolicitudController (services) {
  const { SolicitudService } = services;

  async function findAll (req, res) {
    try {
      const respuesta = await SolicitudService.findAll(req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function listarPorCargo (req, res) {
    try {
      const respuesta = await SolicitudService.listarPorCargo(req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }
  async function listarPorPasoCargo (req, res) {
    try {
      const respuesta = await SolicitudService.listarPorPasoCargo(req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function mostrar (req, res) {
    try {
      debug('Recuperando modulos');
      const respuesta = await SolicitudService.findOne({ id: req.params.id });
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function crear (req, res) {
    try {
      const datos = req.body;
      datos.userCreated = req.user.idUsuario;
      const respuesta = await SolicitudService.createOrUpdate(datos);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function derivar (req, res) {
    try {
      const datos = req.body;
      datos.userUpdated = req.user.idUsuario;
      datos.idCargo = req.user.idCargo;
      datos.id = req.params.id;
      const respuesta = await SolicitudService.derivacion(datos);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }
  async function actualizar (req, res) {
    try {
      const datos = req.body;
      datos.userUpdated = req.user.idUsuario;
      datos.id = req.params.id;
      const respuesta = await SolicitudService.createOrUpdate(datos);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function eliminar (req, res) {
    try {
      const respuesta = await SolicitudService.eliminar(req.params.id);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function generarPdf (req, res) {
    try {
      debug('Recuperando modulos');
      const respuesta = await SolicitudService.generarPdf(req.params.id, req.params.tipoDoc);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }
  async function generarPoaPdf (req, res) {
    try {
      debug('Recuperando modulos');
      const respuesta = await SolicitudService.generarPoaPdf(req.params.id, req.params.tipoDoc);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }
  async function generarPresupuestariaPdf (req, res) {
    try {
      debug('Recuperando modulos');
      const respuesta = await SolicitudService.generarPresupuestariaPdf(req.params.id, req.params.tipoDoc);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }
  async function generarPdfDinamico (req, res) {
    try {
      debug('Recuperando modulos');
      const respuesta = await SolicitudService.generarPdfDinamico(req.params.id, req.params.tipoDoc);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  return {
    mostrar,
    crear,
    derivar,
    actualizar,
    findAll,
    listarPorCargo,
    listarPorPasoCargo,
    eliminar,
    generarPdf,
    generarPoaPdf,
    generarPresupuestariaPdf,
    generarPdfDinamico
  };
};
