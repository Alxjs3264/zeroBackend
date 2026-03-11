'use strict';

const debug = require('debug')('app:service:archivoAdjunto');
const log = require('log4js').getLogger();
const {
  guardarArchivoB64,
  obtenerArchivoB64,
  eliminarArchivo
} = require('../../../common/lib/archivos');
const { ErrorApp } = require('../../lib/error');

module.exports = function ArchivoAdjuntoService (repositories) {
  const { ArchivoAdjuntoRepository, UsuarioRepository } = repositories;

  async function findAll (params = {}) {
    debug('Lista de Archivos Adjuntos Documento|filtros');
    try {
      const resultado = await ArchivoAdjuntoRepository.findAll(params);
      return resultado;
    } catch (err) {
      debug(err);
      throw new ErrorApp(err.message, 400);
    }
  }

  async function findById (id) {
    debug('Buscando Archivos Adjuntos por ID');
    try {
      const resultado = await ArchivoAdjuntoRepository.findById(id);
      if (!resultado) throw new Error('No existe el archivo adjunto');
      return resultado;
    } catch (err) {
      debug(err);
      throw new ErrorApp(err.message, 400);
    }
  }

  async function createOrUpdate (data) {
    debug('Crear o actualizar Archivos Adjuntos');
    let archivoAdjunto;
    try {
      archivoAdjunto = await ArchivoAdjuntoRepository.createOrUpdate(data);

      if (data.userCreated) {
        const usuarioCreacion = await UsuarioRepository.findOne({ id: data.userCreated });
        if (usuarioCreacion) archivoAdjunto.usuarioCreacion = `${usuarioCreacion.nombres} ${usuarioCreacion.primerApellido} ${usuarioCreacion.segundoApellido}`;
      }

      if (data.userUpdated) {
        const usuarioActualizacion = await UsuarioRepository.findOne({ id: data.userUpdated });
        if (usuarioActualizacion) archivoAdjunto.usuarioActualizacion = `${usuarioActualizacion.nombres} ${usuarioActualizacion.primerApellido} ${usuarioActualizacion.segundoApellido}`;
      }

      return archivoAdjunto;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function deleteItem (id) {
    debug('Eliminando Archivos Adjuntos', id);
    try {
      const rol = await ArchivoAdjuntoRepository.findById(id);
      if (!rol) throw new Error('No se encontro el Archivo Adjunto.');
      const resultado = await ArchivoAdjuntoRepository.deleteItem(id);
      return resultado;
    } catch (err) {
      debug(err);
      throw new ErrorApp(err.message, 400);
    }
  }

  /**
   * Crea un archivo adjunto a partir de los parametros dados
   * @param params object que contiene {
      idDocumento: null,
      idDerivacion: null,
      idDerivacionVia: null,
      prefijo: '',
      nombre: '',
      extension: '',
      contenido: '',
      userCreated: null
    }
    * @return Object<archivoAdjunto> Archivo creado.
   */
  async function crearArchivoAdjunto (params = {
    idDocumento     : null,
    idDerivacion    : null,
    idDerivacionVia : null,
    prefijo         : '',
    nombre          : '',
    extension       : '',
    contenido       : '',
    userCreated     : null
  }) {
    let archivoGuardado;
    try {
      archivoGuardado = guardarArchivoB64(params.prefijo, params.nombre, params.extension, params.contenido);
      params.nombre = archivoGuardado.nombre;
      params.ruta = archivoGuardado.ruta;
    } catch (err) {
      log.error(`Error guardando archivo: ${params.nombre}`);
      log.error(err);
      throw new Error(`Error guardando archivo: ${params.nombre}`);
    }

    let archivoCreado;
    try {
      archivoCreado = await ArchivoAdjuntoRepository.createOrUpdate({ ...params });
      return archivoCreado;
    } catch (err) {
      log.error('Error guardando archivo');
      log.error(err);
    }

    try {
      eliminarArchivo(archivoGuardado);
    } catch (err) {
      log.error(err);
      throw new Error(err);
    }
  };

  /**
   * Busca un archivo adjunto en la base de datos por nombre y retornar el registro encontrado.
   */
  async function archivoAdjuntoPorNombre (nombre) {
    let archivoAdjunto;
    try {
      archivoAdjunto = await ArchivoAdjuntoRepository.findOne({ nombre });
    } catch (err) {
      log.error(`Error buscando archivo con nombre: ${nombre}`);
      log.error(err);
      throw new ErrorApp(`Error buscando archivo con nombre: ${nombre}`, 404);
    }
    return archivoAdjunto;
  }

  /**
   * Retorna el contenido de un archivo en base 64.
   */
  async function retornarArchivoB64 (nombre) {
    let archivoAdjunto;
    try {
      archivoAdjunto = await ArchivoAdjuntoRepository.findOne({ nombre });
    } catch (err) {
      log.error(`Error buscando archivo con nombre: ${nombre}`);
      log.error(err);
      throw new ErrorApp(`Error buscando archivo con nombre: ${nombre}`, 404);
    }

    const extension = archivoAdjunto.extension;
    let mimetype = 'data:application/pdf;base64,';
    if (extension == 'pdf') {
      mimetype = 'data:application/pdf;base64,';
    }
    if (extension == 'jpg' || extension == 'png' || extension == 'jpeg') {
      mimetype = `data:image/${extension};base64,`;
    }
    // TODO: Agregar odt, doc, docx
    try {
      return mimetype + obtenerArchivoB64(archivoAdjunto.nombre);
    } catch (error) {
      throw new ErrorApp(error.message, 404);
    }
  }

  return {
    crearArchivoAdjunto,
    retornarArchivoB64,
    archivoAdjuntoPorNombre,
    findAll,
    createOrUpdate,
    findById,
    deleteItem
  };
};
