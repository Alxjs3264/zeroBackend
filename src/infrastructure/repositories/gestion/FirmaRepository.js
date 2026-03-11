'use strict';

const Repository = require('../Repository');
const { getQuery, toJSON } = require('../../lib/util');

module.exports = function firmaRepository (models, Sequelize) {
  const { firma, documento } = models;
  const Op = Sequelize.Op;

  function findAll (params = {}) {
    const query = getQuery(params);
    query.attributes = [
      'id',
      'idDocumento',
      'hash',
      'codigo'
    ];

    query.include = [
      {
        model      : documento,
        attributes : [
          'id',
          'idFlujo',
          'cite',
          'nombrePlantilla',
          'firmado',
          'estado'
        ],
        as: 'documento'
      }
    ];

    query.where = {};

    if (params.idDocumento) {
      query.where.idDocumento = params.idDocumento;
    }

    if (params.codigo) {
      query.where.codigo = params.codigo;
    }

    if (params.hash) {
      query.where.hash = params.hash;
    }

    query.include = [];

    return firma.findAndCountAll(query);
  }

  function findOne (params = {}) {
    const query = getQuery(params);
    query.attributes = [
      'id',
      'idDocumento',
      'hash',
      'codigo'
    ];

    query.include = [
      {
        model      : documento,
        attributes : [
          'id',
          'idFlujo',
          'cite',
          'nombrePlantilla',
          'firmado',
          'estado'
        ],
        as: 'documento'
      }
    ];

    query.where = params;
    return firma.findOne(query);
  }

  return {
    findAll,
    findOne,
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, firma, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, firma, t)
  };
};
