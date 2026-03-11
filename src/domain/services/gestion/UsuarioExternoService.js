'use strict';

const { ErrorApp } = require('../../lib/error');

module.exports = function UsuarioExternoService (repositories, helpers, res) {
  const { UsuarioExternoRepository } = repositories;

  async function findAll (params) {
    try {
      const parametros = await UsuarioExternoRepository.findAll(params);
      return parametros;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function findOne (params) {
    try {
      const parametro = await UsuarioExternoRepository.findOne(params);

      if (!parametro) throw new Error('El parametro no existe');

      return parametro;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function createOrUpdate (datos) {
    try {
      const parametros = await UsuarioExternoRepository.createOrUpdate(datos);
      return parametros;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function eliminar (id) {
    try {
      const parametros = await UsuarioExternoRepository.deleteItem(id);
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
