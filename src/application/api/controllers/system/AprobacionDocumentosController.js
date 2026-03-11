'use strict';

const debug = require('debug')('app:controller:auth');
const log = require('log4js').getLogger();
const { Respuesta } = require('../../../lib/respuesta');
const { Finalizado, HttpCodes } = require('../../../lib/globals');
const { app } = require('../../../../common/config');

module.exports = function setupParametroController (services) {
  const { AprobacionDocumentosService, FlujoDerivacionService, AuthService } = services;

  async function listar (req, res) {
    try {
      const respuesta = await AprobacionDocumentosService.listar(req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function findOne (req, res) {
    try {
      const datos = {
        idDocumento : req.params.idDocumento,
        idUsuario   : req.user.idUsuario

      };
      const respuesta = await AprobacionDocumentosService.findOne(datos);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function generarSolicitud (req, res) {
    try {
      if (app.aprobacionCiudadaniaDigital) {
        await AuthService.verificarVigenciaAccessToken(req.user.token);
      }

      if (app.aprobacionCiudadaniaDigital) await AuthService.verificarVigenciaAccessToken(req.user.token);

      const datos = {
        id        : req.params.id,
        idUsuario : req.user.idUsuario,
        token     : req.user.token
      };
      let respuesta = { linkRedireccion: 'app/error-firma' };
      try {
        respuesta = await AprobacionDocumentosService.generarSolicitud(datos);
      } catch (error) {
        console.log('Error al generar la solicitud de aprobacion');
        console.log(error);
      }
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function notificacionAprobacion (req, res) {
    try {
      const respuestaAprobacion = await AprobacionDocumentosService.resultadoAprobacion(req.body);

      if (respuestaAprobacion.aceptado && respuestaAprobacion.introducido) {
        const datos = {};
        datos.id = respuestaAprobacion.idDocumento;
        datos.userUpdated = respuestaAprobacion.idUsuario;
      }
      return res.status(200).send({ finalizado: true, mensaje: 'Notificación recibida' });
    } catch (error) {
      log.error(error);
      return res.status(error.httpCode || HttpCodes.userError).json({ finalizado: false, mensaje: 'Error recibiendo notificación de aprobación' });
    }
  };

  async function verificarAprobacion(req, res) {
    try {
      const datos = { ...req.body }
      datos.idUsuario = req.user.idUsuario
      const respuesta = await AprobacionDocumentosService.verificarAprobacion(datos);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  return {
    generarSolicitud,
    listar,
    findOne,
    notificacionAprobacion,
    verificarAprobacion
  };
};
