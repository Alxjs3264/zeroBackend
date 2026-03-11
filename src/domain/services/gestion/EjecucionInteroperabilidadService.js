const debug = require('debug')('app:service:FlujoDerivacion');
const { ErrorApp } = require('../../lib/error');

module.exports = function CorrelativoService (repositories) {
  const { EjecucionInteroperabilidadRepository } = repositories;

  async function findAll (params) {
    try {
      debug(params);
      const publicacion = await EjecucionInteroperabilidadRepository.findAll(params);
      return publicacion;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function findOne (params = {}) {
    debug('Mostrando flujo documental: ', params);
    try {
      const publicacion = await EjecucionInteroperabilidadRepository.findOne(params);
      return publicacion;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function createOrUpdate (data) {
    let publicacion;
    try {
      publicacion = await EjecucionInteroperabilidadRepository.createOrUpdate(data);
      return publicacion;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function deleteItemCond (params) {
    try {
      const publicacion = await EjecucionInteroperabilidadRepository.deleteItemCond(params);
      return publicacion;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  return {
    deleteItemCond,
    createOrUpdate,
    findOne,
    findAll
  };
};
