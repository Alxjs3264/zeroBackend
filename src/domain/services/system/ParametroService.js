'use strict';

const debug = require('debug')('app:service:auth');
const { config } = require('../../../common');
const { ErrorApp } = require('../../lib/error');
const { BITACORA } = require('../../../common/config/constants');
module.exports = function parametroService (repositories, helpers, res) {
  const { ParametroRepository, BitacoraRepository } = repositories;

  async function findAll (params) {
    try {
      const parametros = await ParametroRepository.findAll(params);
      return parametros;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function findOne (params) {
    try {
      const parametro = await ParametroRepository.findOne(params);

      if (!parametro) throw new Error('El parametro no existe');

      return parametro;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function createOrUpdate (datos) {
    try {
      const bitacora = datos.bitacora || null
      if (bitacora) {
        delete datos.bitacora
      }
      const parametros = await ParametroRepository.createOrUpdate(datos);
      if (bitacora) {
        await BitacoraRepository.createOrUpdate({
          idItem: parametros.id,
          idUsuario: datos._user_updated,
          userCreated: datos._user_updated,
          justificacion: bitacora.justificacion,
          accion: BITACORA.ACCION_PARAMETRO_INACTIVO,
          nombreTabla: ParametroRepository.getTableName()
        })
      }
      return parametros;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function eliminar (id) {
    try {
      const parametros = await ParametroRepository.deleteItem(id);
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
