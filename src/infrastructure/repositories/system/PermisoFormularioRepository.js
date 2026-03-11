'use strict';

const { getQuery, errorHandler, toJSON } = require('../../lib/util');
const Repository = require('../Repository');

module.exports = function PermisoFormularioRepository (models, Sequelize) {
  const { PermisoFormulario } = models;
  const Op = Sequelize.Op;

  async function findAll (params = {}) {
    const query = {};
    query.where = {};

    const result = await PermisoFormulario.findAndCountAll(query);

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
    if (params.idUsuario) query.where.idUsuario = params.idUsuario;
    if (params.idRol) query.where.idRol = params.idRol;
    const result = await PermisoFormulario.findOne(query);
    if (result) {
      return result.toJSON();
    }
    return null;
  }

  async function findPermisosEntidades (params = {}) {
    const query = {};
    query.where = { idEntidad: { [Op.ne]: null } };

    if (params.idFormulario) query.where.idFormulario = params.idFormulario;

    const result = await PermisoFormulario.findAndCountAll(query);
    return toJSON(result);
  }

  async function findPermisosAreas (params = {}) {
    const query = {};
    query.where = { idArea: { [Op.ne]: null } };

    if (params.idFormulario) query.where.idFormulario = params.idFormulario;

    const result = await PermisoFormulario.findAndCountAll(query);
    return toJSON(result);
  }

  async function deletePermisos (params = {}) {
    const query = {};

    if (params.tipo === 'ENTIDAD') query.idEntidad = { [Op.ne]: null };

    if (params.tipo === 'AREA') query.idArea = { [Op.ne]: null };

    if (params.idFormulario) query.idFormulario = params.idFormulario;

    const result = await Repository.deleteItemCond(query, PermisoFormulario);
    return toJSON(result);
  }

  return {
    deletePermisos,
    findPermisosEntidades,
    findPermisosAreas,
    findOne,
    findAll,
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, PermisoFormulario, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, PermisoFormulario, t),
    deleteItemCond : (params, t) => Repository.deleteItemCond(params, PermisoFormulario, t)
  };
};
