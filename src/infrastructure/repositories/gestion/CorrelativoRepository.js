'use strict';
const debug = require('debug')('app:repository:correlativo');
const Repository = require('../Repository');
const { getQuery, toJSON } = require('../../lib/util');

module.exports = function CorrelativoRepository (models, Sequelize) {
  const { correlativo, entidad, area, formulario } = models;
  const Op = Sequelize.Op;

  async function findAll (params = {}) {
    const query = getQuery(params);
    query.where = {};

    const result = await correlativo.findAndCountAll(query);
    return toJSON(result);
  }

  async function findOne (params, t) {
    const query = { where: params };

    if (t) query.transaction = t;

    query.include = [
      {
        model : entidad,
        as    : 'entidad'
      },
      {
        model : area,
        as    : 'unidadOrganizacional'
      },
      {
        model : formulario,
        as    : 'formulario'
      }
    ];

    const result = await correlativo.findOne(query);

    if (result) return result.toJSON();

    return null;
  }

  return {
    findAll,
    findOne,
    findById       : (id) => Repository.findById(id, correlativo),
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, correlativo, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, correlativo, t),
    deleteItemCond : (params, t) => Repository.deleteItemCond(params, correlativo, t)
  };
};
