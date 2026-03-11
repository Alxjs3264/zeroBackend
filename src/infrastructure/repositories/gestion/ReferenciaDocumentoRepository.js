'use strict';

const { getQuery, toJSON } = require('../../lib/util');
const Repository = require('../Repository');

module.exports = function referenciaDocumentoRepository (models, Sequelize) {
  const { referenciaDocumento, documento } = models;
  const Op = Sequelize.Op;

  const attributes = ['id', 'idDocumento', 'idDocumentoReferenciado', 'createdAt', 'userCreated'];

  async function findAll (params = {}) {
    const query = getQuery(params);
    query.attributes = attributes;
    query.where = {};
    if (params.idDocumento) {
      query.where.idDocumento = params.idDocumento;
    }

    query.include = [
      {
        attributes: [
          'id',
          'asunto',
          'cite'
        ],
        model : documento,
        as    : 'documentoReferenciado'
      }
    ];

    const result = await referenciaDocumento.findAndCountAll(query);
    return toJSON(result);
  }

  async function findOne (params = {}) {
    const query = getQuery(params);
    query.attributes = attributes;
    const result = await referenciaDocumento.findOne(query);
    if (!result) {
      return null;
    }
    return result.toJSON();
  }

  return {
    findAll,
    findOne,
    findById       : id => Repository.findById(id, referenciaDocumento, attributes),
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, referenciaDocumento, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, referenciaDocumento, t)
  };
};
