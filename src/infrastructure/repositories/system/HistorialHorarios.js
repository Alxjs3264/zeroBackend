'use strict';

const { query } = require('express');
const { getQuery, errorHandler, toJSON } = require('../../lib/util');
const Repository = require('../Repository');

module.exports = function HistorialHorariosRepository (models, Sequelize) {
  const Op = Sequelize.Op;
  const { HistorialHorarios } = models;

  async function findAll (params = {}) {
    const query = getQuery(params);

    query.where = { };

    const result = await HistorialHorarios.findAndCountAll(query);
    return toJSON(result);
  }

  return {
    findAll,
    findOne        : params => Repository.findOne(params, HistorialHorarios),
    findById       : id => Repository.findById(id, HistorialHorarios),
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, HistorialHorarios, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, HistorialHorarios, t),
    deleteItemCond : (params, t) => Repository.deleteItemCond(params, HistorialHorarios, t)
  };
};
