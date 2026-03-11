'use strict';

const debug = require('debug')('app:controller:auth');
const { Respuesta } = require('../../../lib/respuesta');
const { Finalizado, HttpCodes } = require('../../../lib/globals');

module.exports = function NotificacionController (services) {
  const { UsuarioService, NotificacionService } = services;

  async function findMarcadosSrh (req, res) {
    try {
      const usuario = await UsuarioService.findOne(req.user.idUsuario)
      const respuesta = await NotificacionService.getMarcadosSRH(usuario.numeroDocumento, usuario.entidad.sigla, usuario.idCargo);
      if (!respuesta) {
        throw new Error('No se encontro el usuario en los registros SRH');
      }      
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }
  async function consentirNotificacion (req, res) {
    try {
      const usuario = await UsuarioService.findOne(req.user.idUsuario)
      const respuesta = await NotificacionService.consentirNotificacion({
        nroDocumento   : usuario.numeroDocumento,
        idNotificacion : req.params.id
      });
      if (!respuesta) {
        throw new Error('No se encontro el usuario en los registros SRH');
      }
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  return {
    findMarcadosSrh,
    consentirNotificacion
  };
};
