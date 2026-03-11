'use strict';
const debug = require('debug')('app:controller:componente');
const log = require('log4js').getLogger();
const uuid = require('uuid');
const fs = require('fs');
const { Respuesta } = require('../../../lib/respuesta');
const { Finalizado, HttpCodes } = require('../../../lib/globals');

module.exports = function setupArchivoAdjuntoController (services) {
  const { ArchivoAdjuntoService, DocumentoService } = services;

  async function listar (req, res) {
    try {
      debug('Recuperando Archivos Adjuntos');
      const respuesta = await ArchivoAdjuntoService.findAll(req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function crear (req, res) {
    try {
      const data = req.body;
      debug('Creando Archivos Adjuntos');
      data.userCreated = req.user.idUsuario;
      const respuesta = await ArchivoAdjuntoService.createOrUpdate(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function actualizar (req, res) {
    try {
      debug('Actualizando Archivos Adjuntos');
      const data = req.body;
      data.id = req.params.id;
      data.userUpdated = req.user.idUsuario;
      const respuesta = await ArchivoAdjuntoService.createOrUpdate(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      log.error(error);
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function eliminar (req, res) {
    try {
      const { id } = req.params;
      debug('Eliminando Archivos Adjuntos');
      const respuesta = await ArchivoAdjuntoService.deleteItem(id);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function upload (req, res) {
    try {
      const dir = 'public/adjuntos';
      const archivos = req.files;
      let fileName = null;
      if (archivos.adjunto) {
        const ext = (archivos.adjunto.name.split('.').pop()).toLowerCase();
        fileName = `${uuid.v4()}.${ext}`;
        const pathFile = `${dir}/${fileName}`;
        await archivos.adjunto.mv(pathFile);
      } else {
        return res.status(404).json(new Respuesta(
          'faltan parametros', Finalizado.FAIL));
      }

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, fileName));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function archivoB64 (req, res) {
    try {
      debug('buscando documento');
      const { nombre } = req.query;
      const archivoEnBD = await ArchivoAdjuntoService.archivoAdjuntoPorNombre(nombre);
      if (!archivoEnBD) {
        return res.status(404).json(new Respuesta(
        `Archivo no encontrado ${nombre}`, Finalizado.FAIL));
      }

      const esVisible = await DocumentoService.esVisibleParaUsuario(archivoEnBD.documento, req.user.idUsuario);
      if (!esVisible) {
        return res.status(401).send(new Respuesta(
          'El usuario no esta autorizado para ver este archivo', Finalizado.FAIL));
      }
      const respuesta = await ArchivoAdjuntoService.retornarArchivoB64(nombre);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      log.error('buscando documento');
      log.error(error);
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function verPdf (req, res) {
    try {
      const id = req.params.id;
      const respuesta = await ArchivoAdjuntoService.findById(id);
      if (respuesta.extension !== 'pdf') throw new Error('No es un archivo PDF');
      const dir = 'public/adjuntos';
      const pathFile = `${dir}/${respuesta.ruta}`;
      if (!fs.existsSync(pathFile)) throw new Error('No se pudo encontar el archivo PDF');
      const adjuntoBase64 = fs.readFileSync(pathFile, 'base64');
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, adjuntoBase64));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  return {
    listar,
    crear,
    actualizar,
    eliminar,
    upload,
    archivoB64,
    verPdf
  };
};
