'use strict';

const debug = require('debug')('app:service:rol');
const Service = require('../Service');
const { ErrorApp } = require('../../lib/error');
const log = require('log4js').getLogger();

module.exports = function rolService (repositories, helpers, res) {
  const { ApitokenEndpointRepository } = repositories;

  async function findAll (params = {}) {
    debug('listar api token endpoints');
    let _apitokenEndpoint;
    try {
      _apitokenEndpoint = await ApitokenEndpointRepository.findAll(params);
      return _apitokenEndpoint;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function createOrUpdate (data) {
    debug('Crear o actualizar apitokenEndpoint');
    let _apitokenEndpoint;
    try {
      _apitokenEndpoint = await ApitokenEndpointRepository.createOrUpdate(data);
      return _apitokenEndpoint;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function getVerifiedRecord (token, endpointGestion) {
    debug('Verificando permisos para tokenapi');
    const record = await ApitokenEndpointRepository.verificarPermisos(token, endpointGestion);
    log.info(`Token api encontrado ${record !== null}`);
    return record;
  }

  return {
    findAll,
    createOrUpdate,
    getVerifiedRecord
  };
};
