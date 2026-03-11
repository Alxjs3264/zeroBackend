'use strict';

const debug = require('debug')('app:service:componente');
const { config } = require('../../../common');
const { ErrorApp } = require('../../lib/error');

module.exports = function servicioService (repositories, helpers, res) {
  const { ServicioRepository } = repositories;

  async function listar (params) {
    try {
      const servicios = await ServicioRepository.findAll(params);
      return servicios;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function findOne (params) {
    try {
      const servicio = await ServicioRepository.findOne(params);
      if (!servicio) {
        throw new Error('El servicio no existe');
      }
      return servicio;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function createOrUpdate (data) {
    debug('Crear o actualizar servicio');
    let servicio;
    try {
      servicio = await ServicioRepository.createOrUpdate(data);
      return servicio;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function deleteItem (id) {
    debug('Eliminando servicio', id);
    try {
      const resultado = await ServicioRepository.deleteItem(id);
      return resultado;
    } catch (err) {
      debug(err);
      throw new ErrorApp(err.message, 400);
    }
  }

  async function findAllBasico (params) {
    try {
      const servicios = await ServicioRepository.findAll(params);
      servicios.rows = servicios.rows.map(x => ({
        id          : x.id,
        nombre      : x.nombre,
        descripcion : x.descripcion,
        metodo      : x.metodo,
        token       : Boolean(x.token),
        parametros  : `${x.urlBase}${x.urlServicio}`.split('/').filter(x => x.includes('@')),
        estado      : 'ACTIVO'
      }));
      return servicios;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function findOneBasico (params) {
    try {
      const servicio = await ServicioRepository.findOne(params);

      if (!servicio) throw new Error('El servicio no existe');

      return {
        id          : servicio.id,
        nombre      : servicio.nombre,
        descripcion : servicio.descripcion,
        url         : `${servicio.urlBase}${servicio.urlServicio}`,
        metodo      : servicio.metodo,
        token       : Boolean(servicio.token),
        parametros  : `${servicio.urlBase}${servicio.urlServicio}`.split('/').filter(x => x.includes('@')),
        estado      : 'ACTIVO'
      };
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }
  return {
    findAllBasico,
    findOneBasico,
    findOne,
    listar,
    createOrUpdate,
    deleteItem
  };
};
