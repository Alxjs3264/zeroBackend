'use strict';

const debug = require('debug')('app:service:auth');
const { config } = require('../../../common');
const { ErrorApp } = require('../../lib/error');

module.exports = function entidadService (repositories, helpers, res) {
  const { EntidadRepository, EntidadUsuarioRepository, transaction } = repositories;

  async function listar (params) {
    try {
      const entidads = await EntidadRepository.findAll(params);
      return entidads;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function findOne (params) {
    try {
      const entidad = await EntidadRepository.findOne(params);

      if (!entidad) throw new Error('La entidad no existe');

      entidad.funcionarios = entidad.funcionarios.map(x => ({ idUsuario: x.sys_entidad_usuario.idUsuario, idFuncion: x.sys_entidad_usuario.idFuncion }));

      return entidad;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function createOrUpdate (data) {
    debug('Crear o actualizar Entidad');
    let entidad;
    let transaccion;
    try {
      transaccion = await transaction.create();
      entidad = await EntidadRepository.createOrUpdate(data, transaccion);

      if (data.funcionarios) {
        await EntidadUsuarioRepository.deleteItemCond({ idEntidad: entidad.id }, transaccion);
        for (const configuracionUsuario of data.funcionarios) {
          const existe = await EntidadUsuarioRepository.findOne({
            idEntidad : entidad.id,
            idUsuario : configuracionUsuario.idUsuario,
            idFuncion : configuracionUsuario.idFuncion
          }, transaccion);
          if (!existe) {
            await EntidadUsuarioRepository.createOrUpdate({
              idEntidad   : entidad.id,
              idUsuario   : configuracionUsuario.idUsuario,
              idFuncion   : configuracionUsuario.idFuncion,
              userCreated : data.userCreated || data.userUpdated
            }, transaccion);
          }
        }
      }

      await transaction.commit(transaccion);
      return entidad;
    } catch (error) {
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function deleteItem (id) {
    debug('Eliminando entidad', id);
    try {
      const resultado = await EntidadRepository.deleteItem(id);
      return resultado;
    } catch (err) {
      debug(err);
      throw new ErrorApp(err.message, 400);
    }
  }

  async function importar (entidades) {
    debug('Crear o actualizar Entidad');
    let transaccion;
    try {
      transaccion = await transaction.create();

      for (const entidad of entidades) {
        entidad.errores = [];
        const existeEntidad = await EntidadRepository.existe({
          id     : entidad.id,
          nombre : entidad.nombre,
          codigo : entidad.codigo,
          sigla  : entidad.sigla
        });

        if (!existeEntidad) {
          await EntidadRepository.createOrUpdate(entidad, transaccion);
        }

        if (existeEntidad) entidad.errores.push('El registro ya existe');
      }

      await transaction.commit(transaccion);
      return entidades;
    } catch (error) {
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  return {
    importar,
    findOne,
    listar,
    createOrUpdate,
    deleteItem
  };
};
