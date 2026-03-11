'use strict';

const { getQuery, errorHandler, toJSON } = require('../../lib/util');
const Repository = require('../Repository');

module.exports = function PermisoSolicitudRepository (models, Sequelize) {
  const { PermisoSolicitud } = models;
  const Op = Sequelize.Op;

  async function findAll (params = {}) {
    const query = {};
    query.where = {};

    const result = await PermisoSolicitud.findAndCountAll(query);

    if (result) {
      return result;
    }
    return null;
  }

  async function findOne (params = {}) {
    const query = {};
    query.where = {};
    if (params.id) {
      query.where.id = params.id;
    }
    if (params.idUsuario) {
      query.where.idUsuario = params.idUsuario;
    }

    if (params.idRol) {
      query.where.idRol = params.idRol;
    }
    const result = await PermisoSolicitud.findOne(query);
    if (result) {
      return result.toJSON();
    }
    return null;
  }

  async function findPermisosEntidades (params = {}) {
    const query = {};
    query.where = { idEntidad: { [Op.ne]: null } };

    if (params.idSolicitudPlantilla) query.where.idSolicitudPlantilla = params.idSolicitudPlantilla;

    const result = await PermisoSolicitud.findAndCountAll(query);
    return toJSON(result);
  }

  async function findPermisosAreas (params = {}) {
    const query = {};
    query.where = { idArea: { [Op.ne]: null } };

    if (params.idSolicitudPlantilla) query.where.idSolicitudPlantilla = params.idSolicitudPlantilla;

    const result = await PermisoSolicitud.findAndCountAll(query);
    return toJSON(result);
  }

  async function deletePermisos (params = {}) {
    const query = {};

    if (params.tipo === 'ENTIDAD') query.idEntidad = { [Op.ne]: null };

    if (params.tipo === 'AREA') query.idArea = { [Op.ne]: null };

    if (params.idSolicitudPlantilla) query.idSolicitudPlantilla = params.idSolicitudPlantilla;

    const result = await Repository.deleteItemCond(query, PermisoSolicitud);
    return toJSON(result);
  }

  return {
    deletePermisos,
    findPermisosEntidades,
    findPermisosAreas,
    findOne,
    findAll,
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, PermisoSolicitud, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, PermisoSolicitud, t),
    deleteItemCond : (params, t) => Repository.deleteItemCond(params, PermisoSolicitud, t)
  };
};
