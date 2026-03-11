'use strict';

const { getQuery, toJSON } = require('../../lib/util');
const Repository = require('../Repository');

module.exports = function rolesRepository (models, Sequelize) {
  const { Bitacora } = models;
  const Op = Sequelize.Op;

  async function findAll (params = {}) {
    const query = getQuery(params);
    query.where = {};

    const result = await Bitacora.findAndCountAll(query);
    return toJSON(result);
  }

  async function findOne (params = {}) {
    const query = {
      where: params
    };
    const result = await Bitacora.findOne(query);
    if (!result) {
      return null;
    }
    return result.toJSON();
  }

  return {
    findAll,
    findOne,
    findById       : id => Repository.findById(id, Bitacora),
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, Bitacora, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, Bitacora, t)
  };
};
