'use strict';

const debug = require('debug')('app:service:auth');
const { config } = require('../../../../common');
const { ErrorApp } = require('../../../lib/error');
module.exports = function ConfiguracionCargoRepository (repositories, helpers, res) {
  const { ConfiguracionCargoRepository } = repositories.planificacion;

  async function findAll (params) {
    try {
      const configuracionCargo = await ConfiguracionCargoRepository.findAll(params);
      return configuracionCargo;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function findOne (params) {
    try {
      const configuracionCargo = await ConfiguracionCargoRepository.findOne(params);
      if (!configuracionCargo) {
        throw new Error('El cargo no existe');
      }
      return configuracionCargo;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function createOrUpdate (datos) {
    try {
      const configuracionCargo = await ConfiguracionCargoRepository.createOrUpdate(datos);
      return configuracionCargo;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function eliminar (id) {
    try {
      const configuracionCargo = await ConfiguracionCargoRepository.deleteItem(id);
      return configuracionCargo;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  return {
    findOne,
    eliminar,
    createOrUpdate,
    findAll
  };
};
