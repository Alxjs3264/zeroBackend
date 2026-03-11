
'use strict';
const debug = require('debug')('app:controller:REPORTE');
const { Respuesta } = require('../../../lib/respuesta');
const { Finalizado, HttpCodes } = require('../../../lib/globals');
const { config } = require('../../../../common');
const path = require('path');
const fs = require('fs');

module.exports = function setupEntidadController (services) {
  const { EntidadService, AuthService } = services;

  async function listar (req, res) {
    try {
      await AuthService.verificarPermisoEntidades(req, ['listar:entidades:entidad']);

      const respuesta = await EntidadService.listar(req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }
  async function listarPor (req, res) {
    try {
      debug('listar por');
      const data = req.body;
      data.id = req.params.id;
      const respuesta = await EntidadService.findOne(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function crear (req, res) {
    try {
      const data = req.body;
      debug('creando entidad');
      data.userCreated = req.user.idUsuario; // corregir
      const respuesta = await EntidadService.createOrUpdate(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function actualizar (req, res) {
    try {
      debug('actualizando entidad');
      const data = req.body;
      data.id = req.params.id;
      data.userUpdated = req.user.idUsuario;

      const respuesta = await EntidadService.createOrUpdate(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function eliminar (req, res) {
    try {
      const { id } = req.params;
      debug('Eliminando entidad');
      const respuesta = await EntidadService.deleteItem(id);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function subirArchivo (req, res) {
    try {
      const { files } = req;

      const { backendUrl } = config.app;

      if (!files) throw new Error('Debe enviar por lo menos un archivo');

      // eslint-disable-next-line no-unreachable-loop
      for (const key in files) {
        const file = files[key];
        const filename = `file-${Date.now()}.${file.name.split('.').pop()}`;
        const filepath = `public/images/${filename}`;
        await file.mv(path.join(process.cwd(), filepath));

        if (!fs.existsSync(path.join(process.cwd(), filepath)))  throw new Error('Se produjo un error al subir el archivo.');

        return res.status(200).send(new Respuesta('OK', Finalizado.OK, {
          url    : `${backendUrl}/images/${filename}`,
          nombre : filename
        }));
      }
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function importar (req, res) {
    try {
      const data = req.body;
      const respuesta = await EntidadService.importar(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  return {
    importar,
    subirArchivo,
    listar,
    listarPor,
    eliminar,
    actualizar,
    crear
  };
};
