'use strict';

const debug = require('debug')('app:service:modulo');
const { ErrorApp } = require('../../lib/error');

module.exports = function permisoService (repositories, helpers, res) {
  const { UsuarioCargoRepository } = repositories;

  async function listar (params = {}) {
    debug('Obteniendo menú del rol seleccionado');
    try {
      const permisos = await UsuarioCargoRepository.findAll(params);
      if (params.idUsuario) {
        const nuevoSet = new Set();
        const arrayFiltrado = permisos.rows.filter(i => {
          if (!nuevoSet.has(i.idCargo)) {
            nuevoSet.add(i.idCargo);
            return true;
          }
          return false;
        });
        // console.log(arrayFiltrado);
        permisos.rows = arrayFiltrado;
        permisos.count = arrayFiltrado.length;
      }
      return permisos;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function createOrUpdate (datos = {}) {
    debug('Creando o actualizando permisos');
    try {
      const permiso = await UsuarioCargoRepository.createOrUpdate(datos);
      return permiso;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function findOne (params = {}) {
    debug('Obteniendo menú del rol seleccionado');
    try {
      const permisos = await UsuarioCargoRepository.findOne(params);
      return permisos;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function mostrar (idModulo = null) {
    debug('Obteniendo menú del rol seleccionado');
    try {
      const permisos = await UsuarioCargoRepository.findOne({ id: idModulo });
      return permisos;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function buscarFiltros (req = {}, nombresPermisos = []) {
    try {
      const permisos = await UsuarioCargoRepository.verificarPermisos({
        roles    : req.user.idRoles,
        permisos : nombresPermisos
      });
      if (permisos) {
        delete req.query.idEntidad;
      } else {
        req.query.entidades = req.user.entidadesDependientes;
      }
      return req;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function verificarPermisos (roles, nombresPermisos = []) {
    try {
      const permisos = await UsuarioCargoRepository.verificarPermisos({
        roles    : roles,
        permisos : nombresPermisos
      });
      if (permisos) {
        return true;
      }
      return false;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  return {
    verificarPermisos,
    buscarFiltros,
    createOrUpdate,
    findOne,
    listar,
    mostrar
  };
};
