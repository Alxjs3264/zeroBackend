'use strict';

const { query } = require('express');
const { getQuery, errorHandler, toJSON } = require('../../lib/util');
const Repository = require('../Repository');

module.exports = function logIopRepository (models, Sequelize) {
  const Op = Sequelize.Op;
  const { LogIop } = models;

  async function findAll (params = {}) {
    const query = getQuery(params);

    query.where = { };

    const result = await LogIop.findAndCountAll(query);
    return toJSON(result);
  }

  return {
    findAll,
    findOne        : params => Repository.findOne(params, LogIop),
    findById       : id => Repository.findById(id, LogIop),
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, LogIop, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, LogIop, t),
    deleteItemCond : (params, t) => Repository.deleteItemCond(params, LogIop, t)
  };
};
