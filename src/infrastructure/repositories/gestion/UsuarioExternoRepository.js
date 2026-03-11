'use strict';

const { getQuery, toJSON } = require('../../lib/util');
const Repository = require('../Repository');

module.exports = function UsuarioExternoRepository (models, Sequelize) {
  const { UsuarioExterno } = models;
  const Op = Sequelize.Op;

  async function findAll (params = {}) {
    const query = getQuery(params);
    query.where = {};

    if (params.nombreCompleto) query.where.nombreCompleto = { [Op.iLike]: `%${params.nombreCompleto}%` };
    if (params.cargo) query.where.cargo = { [Op.iLike]: `%${params.cargo}%` };
    if (params.procedencia) query.where.procedencia = { [Op.iLike]: `%${params.procedencia}%` };

    if (params.id) {
      query.where.id = params.id;
      if (Array.isArray(params.id)) query.where.id = { [Op.in]: params.id };
    }

    const result = await UsuarioExterno.findAndCountAll(query);
    return toJSON(result);
  }

  return {
    findAll,
    findOne        : (params, t) => Repository.findOne(params, UsuarioExterno, t),
    findById       : (id) => Repository.findById(id, UsuarioExterno),
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, UsuarioExterno, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, UsuarioExterno, t),
    deleteItemCond : (params, t) => Repository.deleteItemCond(params, UsuarioExterno, t)
  };
};
