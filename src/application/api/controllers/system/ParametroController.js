'use strict';

const debug = require('debug')('app:controller:auth');
const { Respuesta } = require('../../../lib/respuesta');
const { Finalizado, HttpCodes } = require('../../../lib/globals');
const { app } = require('../../../../common/config');

module.exports = function setupParametroController (services) {
  const { ParametroService, CiudadanoService } = services;

  async function findAll (req, res) {
    try {
      const respuesta = await ParametroService.findAll(req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function mostrar (req, res) {
    try {
      debug('Recuperando modulos');
      const respuesta = await ParametroService.findOne({ id: req.params.id });
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function crear (req, res) {
    try {
      const datos = req.body;
      datos.userCreated = req.user.idUsuario;
      const respuesta = await ParametroService.createOrUpdate(datos);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function actualizar (req, res) {
    try {
      // throw new Error('Prueba')
      const datos = req.body;
      datos._user_updated = req.user.idUsuario;
      datos.id = req.params.id;
      let respuesta = null
      if (datos.id === 'a4aaff33-11c8-4bc8-ada9-d9f24e708baf' && datos.estado === 'INACTIVO' && app.verificarConexionIOP) {
        try {
          await CiudadanoService.checkCiudadaniaStatus(true)
        } catch (error) {
          respuesta = await ParametroService.createOrUpdate(datos);
        }
        if (!respuesta) {
          throw new Error('El servicio de CIUDADANIA DIGITAL se cuentra estable, no se puede modificar el estado')
        }
      } else {
        respuesta = await ParametroService.createOrUpdate(datos);
      }
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function eliminar (req, res) {
    try {
      const respuesta = await ParametroService.eliminar(req.params.id);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  return {
    mostrar,
    crear,
    actualizar,
    findAll,
    eliminar
  };
};
