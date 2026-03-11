'use strict';

const { getQuery, toJSON } = require('../../lib/util');
const Repository = require('../Repository');
const debug = require('debug')('app:Repository:Paso');

module.exports = function PasoAnteriorRepository (models) {
  const { PasoAnterior } = models;

  async function findAll (params = {}) {
    debug(params);
    const query = getQuery(params);

    query.where = {};

    query.include = [];

    const result = await PasoAnterior.findAndCountAll(query);
    return toJSON(result);
  }

  async function findOne (params = {}) {
    const query = {};
    query.where = params;

    const result = await PasoAnterior.findOne(query);

    if (result) {
      return result.toJSON();
    }

    return null;
  }

  return {
    findAll,
    findOne,
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, PasoAnterior, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, PasoAnterior, t),
    deleteItemCond : (params, t) => Repository.deleteItemCond(params, PasoAnterior, t)
  };
};
