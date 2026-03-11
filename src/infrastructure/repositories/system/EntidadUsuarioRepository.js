'use strict';
const debug = require('debug')('app:repository:correlativo');
const Repository = require('../Repository');
const { getQuery, toJSON } = require('../../lib/util');

module.exports = function CorrelativoRepository (models, Sequelize) {
  const { EntidadUsuario } = models;
  const Op = Sequelize.Op;

  async function findAll (params = {}) {
    const query = getQuery(params);
    query.where = {};

    const result = await EntidadUsuario.findAndCountAll(query);
    return toJSON(result);
  }

  async function findOne (params, t) {
    const query = { where: params };

    if (t) query.transaction = t;

    query.order = [['createdAt', 'DESC']];

    const result = await EntidadUsuario.findOne(query);

    if (result) return result.toJSON();

    return null;
  }

  return {
    findAll,
    findOne,
    findById       : (id) => Repository.findById(id, EntidadUsuario),
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, EntidadUsuario, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, EntidadUsuario, t),
    deleteItemCond : (params, t) => Repository.deleteItemCond(params, EntidadUsuario, t)
  };
};
