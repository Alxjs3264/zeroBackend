'use strict';

const debug = require('debug')('app:service:rol');
const { ErrorApp } = require('../../lib/error');
module.exports = function referenciaDocumentoService (repositories) {
  const { ReferenciaDocumentoRepository } = repositories;

  async function findAll (params = {}) {
    debug('Lista de Referencia Documentoi|filtros');
    try {
      const resultado = await ReferenciaDocumentoRepository.findAll(params);
      return resultado;
    } catch (err) {
      debug(err);
      throw new ErrorApp(err.message, 400);
    }
  }

  async function findById (id) {
    debug('Buscando Referencia Documento por ID');
    try {
      const resultado = await ReferenciaDocumentoRepository.findOne({ id });
      return resultado;
    } catch (err) {
      debug(err);
      throw new ErrorApp(err.message, 400);
    }
  }

  async function createOrUpdate (data) {
    debug('Crear o actualizar Referencia Documento');
    let rol;
    try {
      rol = await ReferenciaDocumentoRepository.createOrUpdate(data);
      return rol;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function deleteItem (id) {
    debug('Eliminando Referencia Documento', id);
    try {
      const rol = await ReferenciaDocumentoRepository.findById(id);
      if (!rol) throw new Error('No se encontro la Referencia Documento.');
      const resultado = await ReferenciaDocumentoRepository.deleteItem(id);
      return resultado;
    } catch (err) {
      debug(err);
      throw new ErrorApp(err.message, 400);
    }
  }

  return {
    findAll,
    findById,
    createOrUpdate,
    deleteItem
  };
};
