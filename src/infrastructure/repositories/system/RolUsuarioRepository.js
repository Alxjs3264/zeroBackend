'use strict';

const { getQuery, errorHandler, toJSON } = require('../../lib/util');
const Repository = require('../Repository');

module.exports = function rolUsuarioRepository (models, Sequelize) {
  const { rolUsuario } = models;

  async function findOne (params = {}) {
    const query = { where: params };

    const result = await rolUsuario.findOne(query);
    if (result) return result.toJSON();
    return null;
  }

  return {
    findOne,
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, rolUsuario, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, rolUsuario, t),
    deleteItemCond : (params, t) => Repository.deleteItemCond(params, rolUsuario, t)
  };
};
