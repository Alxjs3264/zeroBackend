'use strict';
const debug = require('debug')('app:controller:formulario');
const { Respuesta } = require('../../../lib/respuesta');
const { Finalizado, HttpCodes } = require('../../../lib/globals');

module.exports = function setupSolicitudPlantillaController (services) {
  const { SolicitudPlantillaService, CargoService } = services;

  async function findAll (req, res) {
    try {
      if (req.query.filtrosEntidad) {
        req.query.idEntidad = req.user.idEntidad;
        const cargo = await CargoService.findOne({ id: req.user.idCargo });
        req.query.idAreas = cargo.idUnidadOrganizacional;
      }

      const respuesta = await SolicitudPlantillaService.findAll(req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta, null, req, services));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function findPasosIniciales (req, res) {
    try {
      const idSolicitudPlantilla = req.params.id;
      const respuesta = await SolicitudPlantillaService.findPasosIniciales(idSolicitudPlantilla);

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function findOne (req, res) {
    try {
      const data = req.body;
      data.id = req.params.id;
      const respuesta = await SolicitudPlantillaService.findOne(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta, null, req, services));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function createItem (req, res) {
    try {
      const data = req.body;
      debug('creando formulario');
      data.userCreated = req.user.idUsuario;
      const respuesta = await SolicitudPlantillaService.createOrUpdate(data);

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
      const respuesta = await SolicitudPlantillaService.createOrUpdate(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta, null, req, services));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function deleteItem (req, res) {
    try {
      const { id } = req.params;
      debug('Eliminando formulario');
      const respuesta = await SolicitudPlantillaService.deleteItem(id);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta, null, req, services));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function clonarsolicitudPlantilla (req, res) {
    try {
      const data = {
        id          : req.params.id,
        titulo      : req.body.nuevoTitulo,
        userCreated : req.user.idUsuario
      };
      const respuesta = await SolicitudPlantillaService.clonarsolicitudPlantilla(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta, null, req, services));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function listarPermisosEntidad (req, res) {
    try {
      const idSolicitudPlantilla = req.query.idSolicitudPlantilla;
      const permisosEntidades = await SolicitudPlantillaService.listarPermisosEntidad(idSolicitudPlantilla);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, permisosEntidades, null, req, services));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function listarPermisosArea (req, res) {
    try {
      const idSolicitudPlantilla = req.query.idSolicitudPlantilla;
      const permisosAreas = await  SolicitudPlantillaService.listarPermisosAreas(idSolicitudPlantilla);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, permisosAreas, null, req, services));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  return {
    listarPermisosEntidad,
    listarPermisosArea,
    clonarsolicitudPlantilla,
    findPasosIniciales,
    findAll,
    findOne,
    createItem,
    updateItem,
    deleteItem
  };
};
