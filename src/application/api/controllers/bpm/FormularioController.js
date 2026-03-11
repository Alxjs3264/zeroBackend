
'use strict';
const debug = require('debug')('app:controller:formulario');
const { Respuesta } = require('../../../lib/respuesta');
const { Finalizado, HttpCodes } = require('../../../lib/globals');

module.exports = function setupFormularioController (services) {
  const { FormularioService, CargoService } = services;

  async function listar (req, res) {
    try {
      if (req.query.filtrosEntidad) {
        req.query.idEntidad = req.user.idEntidad;
        const cargo = await CargoService.findOne({ id: req.user.idCargo });
        req.query.idAreas = cargo.idUnidadOrganizacional;
      }

      const respuesta = await FormularioService.listar(req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta, null, req, services));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function listarCampos (req, res) {
    try {
      const respuesta = await FormularioService.listarCampos(req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta, null, req, services));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function listarFormulario (req, res) {
    try {
      const respuesta = await FormularioService.listarFormulario(req.query, req.user.idUsuario, req.user.idRol);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta, null, req, services));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }
  async function listarpor (req, res) {
    try {
      const data = req.body;
      data.id = req.params.id;
      const respuesta = await FormularioService.listarpor(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta, null, req, services));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }
  async function crear (req, res) {
    try {
      const data = req.body;
      debug('creando formulario');
      data.userCreated = req.user.idUsuario;
      const respuesta = await FormularioService.createOrUpdateCompleto(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta, null, req, services));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function actualizar (req, res) {
    try {
      const data = req.body;
      debug('actualizando formulario');
      data.id = req.params.id;
      data.userUpdated = req.user.idUsuario;
      const respuesta = await FormularioService.createOrUpdate(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta, null, req, services));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function eliminar (req, res) {
    try {
      const { id } = req.params;
      debug('Eliminando formulario');
      const respuesta = await FormularioService.deleteItem(id);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta, null, req, services));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function listarPermisosEntidad (req, res) {
    try {
      const idFormulario = req.query.idFormulario;
      const permisosEntidades = await FormularioService.listarPermisosEntidad(idFormulario);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, permisosEntidades, null, req, services));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function listarPermisosArea (req, res) {
    try {
      const idFormulario = req.query.idFormulario;
      const permisosAreas = await  FormularioService.listarPermisosAreas(idFormulario);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, permisosAreas, null, req, services));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  return {
    listarPermisosEntidad,
    listarPermisosArea,
    listarCampos,
    listar,
    listarFormulario,
    listarpor,
    eliminar,
    actualizar,
    crear
  };
};
