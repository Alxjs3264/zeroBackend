'use strict';

const debug = require('debug')('app:service:auth');
const { config } = require('../../../common');
const { ErrorApp } = require('../../lib/error');

module.exports = function parametroService (repositories, helpers, res) {
  const { CarpetaRepository } = repositories;

  const { CargoRepository } = repositories.planificacion;

  async function findAll (params) {
    try {
      const cargo = await CargoRepository.findOne({ id: params.idCargo });
      params.idArea = cargo?.unidad?.id;

      const parametros = await CarpetaRepository.findAll(params);
      return parametros;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function findOne (params) {
    try {
      const comentario = await CarpetaRepository.findOne(params);
      if (!comentario) {
        throw new Error('El comentario no existe');
      }
      return comentario;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function createOrUpdate (datos) {
    try {
      const cargo = await CargoRepository.findOne({ id: datos.idCargo });
      if (!cargo)  throw new Error('No existe el cargo');

      if (!cargo?.unidad?.id)  throw new Error('No el area del cargo');

      datos.idAreaCreacion = cargo?.unidad?.id;

      const parametros = await CarpetaRepository.createOrUpdate(datos);
      return parametros;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function eliminar (id) {
    try {
      const parametros = await CarpetaRepository.deleteItem(id);
      return parametros;
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
