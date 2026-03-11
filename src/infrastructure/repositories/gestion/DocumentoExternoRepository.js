'use strict';

const Repository = require('../Repository');
const { getQuery, toJSON } = require('../../lib/util');

module.exports = function derivacionRepository (models, Sequelize) {
  const { documentoExterno, flujoDocumental } = models;
  const Op = Sequelize.Op;

  function findAll (params = {}) {
    const query = getQuery(params);
    query.attributes = [
      'id',
      'cite',
      'remitenteDe',
      'destinatarioPara',
      'referenciaDocumento',
      'rutaDocumento',
      'fechaEmitido',
      'observacion',
      'etapaDocumento',
      'estado'
    ];

    query.include = [
      {
        model    : flujoDocumental,
        attributes: [
          'id',
          'tipoFlujo',
          'etapaFlujo',
          'nroCopia',
          'idFlujoPadre',
          'estado'
        ],
        as       : 'flujoDocumental'
      },
    ];
    
    query.where = {};

    if (params.idFlujo) {
      query.where.idFlujo = params.idFlujo;
    }
         
    if (params.remitenteDe) {
      query.where.remitenteDe = params.remitenteDe;
    }

    if (params.destinatarioPara) {
      query.where.destinatarioPara = params.destinatarioPara;
    }

    if (params.referenciaDocumento) {
      query.where.referenciaDocumento = params.referenciaDocumento;
    }

    if (params.rutaDocumento) {
      query.where.rutaDocumento = params.rutaDocumento;
    }

    if (params.fechaEmitido) {
      query.where.fechaEmitido = params.fechaEmitido;
    }

    query.include = [];

    return documentoExterno.findAndCountAll(query);
  }

  function findOne (params = {}) {
    const query = getQuery(params);
    query.attributes = [
      'id',
      'cite',
      'remitenteDe',
      'destinatarioPara',
      'referenciaDocumento',
      'rutaDocumento',
      'fechaEmitido',
      'observacion',
      'etapaDocumento',
      'estado'
    ];

    query.include = [
      {
        model    : flujoDocumental,
        attributes: [
          'id',
          'tipoFlujo',
          'etapaFlujo',
          'nroCopia',
          'idFlujoPadre',
          'estado'
        ],
        as       : 'flujoDocumental'
      },
    ];

    query.where = params;
    return documentoExterno.findOne(query);
  }

  return {
    findAll,
    findOne,  
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, documentoExterno, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, documentoExterno, t)
  };
};
