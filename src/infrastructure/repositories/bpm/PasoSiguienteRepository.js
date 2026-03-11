'use strict';

const { getQuery, toJSON } = require('../../lib/util');
const Repository = require('../Repository');
const debug = require('debug')('app:Repository:Paso');

module.exports = function PasoSiguienteRepository (models) {
  const { PasoSiguiente } = models;

  async function findAll (params = {}) {
    debug(params);
    const query = getQuery(params);

    query.where = {};

    query.include = [];

    const result = await PasoSiguiente.findAndCountAll(query);
    return toJSON(result);
  }

  async function findOne (params = {}) {
    const query = {};
    query.where = params;

    const result = await PasoSiguiente.findOne(query);

    if (result) {
      return result.toJSON();
    }

    return null;
  }

  return {
    findAll,
    findOne,
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, PasoSiguiente, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, PasoSiguiente, t),
    deleteItemCond : (params, t) => Repository.deleteItemCond(params, PasoSiguiente, t)
  };
};
