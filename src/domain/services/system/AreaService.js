'use strict';

const debug = require('debug')('app:service:auth');
const { config } = require('../../../common');
const { TIPO_HEADER_FOOTER } = require('../../../common/config/constants');
const { ErrorApp } = require('../../lib/error');
module.exports = function parametroService (repositories, helpers, res) {
  const { AreaRepository, transaction, EntidadRepository } = repositories;

  async function findAll (params) {
    try {
      const parametros = await AreaRepository.findAll(params);
      return parametros;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function findOne (params) {
    try {
      const comentario = await AreaRepository.findOne(params);
      if (!comentario) {
        throw new Error('El comentario no existe');
      }
      return comentario;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function createOrUpdate (datos) {
    let transaccion;
    try {
      transaccion = await transaction.create();

      const area = await AreaRepository.createOrUpdate(datos, transaccion);

      if (datos.tipoHeader === TIPO_HEADER_FOOTER.ENTIDAD) {
        await AreaRepository.update({ idEntidad: datos.idEntidad, estado: 'ACTIVO' }, { contenidoHeader: datos.contenidoHeader }, transaccion);
      }

      if (datos.tipoFooter === TIPO_HEADER_FOOTER.ENTIDAD) {
        await AreaRepository.update({ idEntidad: datos.idEntidad, estado: 'ACTIVO' }, { contenidoFooter: datos.contenidoFooter }, transaccion);
      }

      if (datos.tipoHeader === TIPO_HEADER_FOOTER.TODOS) {
        await AreaRepository.update({ estado: 'ACTIVO' }, { contenidoHeader: datos.contenidoHeader }, transaccion);
      }

      if (datos.tipoFooter === TIPO_HEADER_FOOTER.TODOS) {
        await AreaRepository.update({ estado: 'ACTIVO' }, { contenidoFooter: datos.contenidoFooter }, transaccion);
      }

      await transaction.commit(transaccion);
      return area;
    } catch (error) {
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function eliminar (id) {
    try {
      const parametros = await AreaRepository.deleteItem(id);
      return parametros;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function importar (areas) {
    let transaccion;
    try {
      transaccion = await transaction.create();

      for (const area of areas) {
        area.errores = [];
        const existeEntidad = await EntidadRepository.findOne({ codigo: area.codigoEntidad });

        if (existeEntidad) {
          area.idEntidad =  existeEntidad.id;
          const existeArea = await AreaRepository.existe({
            id         : area.id,
            idEntidad  : existeEntidad.id,
            nombreArea : area.nombreArea,
            sigla      : area.sigla
          });
          if (!existeArea) {
            await AreaRepository.createOrUpdate(area, transaccion);
          }
          if (existeArea) area.errores.push('El area/unidad ya fue registrado anteriormente.');
        }

        if (!existeEntidad) area.errores.push(`La entidad con el codigo ${area.codigoEntidad} no existe`);
      }

      await transaction.commit(transaccion);
      return areas;
    } catch (error) {
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  return {
    importar,
    findOne,
    eliminar,
    createOrUpdate,
    findAll
  };
};
