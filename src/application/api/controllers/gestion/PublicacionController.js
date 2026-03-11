
'use strict';
const debug = require('debug')('app:controller:formulario');
const { Respuesta } = require('../../../lib/respuesta');
const { Finalizado, HttpCodes } = require('../../../lib/globals');
const { app } = require('../../../../common/config');

module.exports = function setupSolicitudPlantillaController (services) {
  const { PublicacionService, CargoService, UsuarioService } = services;

  async function findAll (req, res) {
    try {
      if (req.query.filtroArea) {
        const cargo = await CargoService.findOne({ id: req.user.idCargo });
        req.query.idArea = cargo.unidad?.id || null;
      }
      if (req.query.idCategoria) {
        req.query.idCategoria = req.query.idCategoria.split(',');
      }
      if (req.query.nombreUsuario) {
        const usuarios = await UsuarioService.listarUsuarios({ search: req.query.nombreUsuario });
        if (usuarios.count) {
          req.query.idUsuario = usuarios.rows.map((u) => u.id);
        }
      }
      const respuesta = await PublicacionService.findAll(req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta, null, req, services));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function findOne (req, res) {
    try {
      const data = req.body;
      data.id = req.params.id;
      const respuesta = await PublicacionService.findOne(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta, null, req, services));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function createItem (req, res) {
    try {
      const data = req.body;
      debug('creando formulario');
      data.idUsuario = req.user.idUsuario;
      data.userCreated = req.user.idUsuario;
      if (req.files?.archivo) {
        await req.files?.archivo.mv(`${app.ARCHIVOS_PUBLICOS}/${req.files.archivo.name}`);
        data.nombreArchivo = req.files.archivo.name;
      }
      const respuesta = await PublicacionService.createOrUpdate(data);
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
      const respuesta = await PublicacionService.createOrUpdate(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta, null, req, services));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function deleteItem (req, res) {
    try {
      const { id } = req.params;
      debug('Eliminando formulario');
      const respuesta = await PublicacionService.deleteItemCond({ id });
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta, null, req, services));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  return {
    findAll,
    findOne,
    createItem,
    updateItem,
    deleteItem
  };
};
