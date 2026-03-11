'use strict';

const Repository = require('../Repository');
const { getQuery, toJSON } = require('../../lib/util');
const { log } = require('log4js').getLogger();

module.exports = function derivacionViaRepository (models, Sequelize) {
  const { derivacion, derivacionVia, documento, flujoDocumental } = models;
  const Op = Sequelize.Op;

  // function findAll (params = {}) {
  //   const query = getQuery(params);
  //   query.attributes = [
  //     'id',
  //     'idFlujo',
  //     'codigoFlujo',
  //     'usuarioInicial',
  //     'usuarioFinal',
  //     'accion',
  //     'descripcion',
  //     'estado'
  //   ];

  //   query.include = [
  //     {
  //       model    : flujoDocumental,
  //       attributes: [
  //         'id',
  //         'tipoFlujo',
  //         'etapaFlujo',
  //         'nroCopia',
  //         'idFlujoPadre',
  //         'estado'
  //       ],
  //       as       : 'flujoDocumental'
  //     },
  //   ];
    
  //   query.where = {};

  //   if (params.idFlujo) {
  //     query.where.idFlujo = params.idFlujo;
  //   }
         
  //   if (params.codigoFlujo) {
  //     query.where.codigoFlujo = params.codigoFlujo;
  //   }
         
  //   if (params.usuarioInicial) {
  //     query.where.usuarioInicial = params.usuarioInicial;
  //   }

  //   if (params.usuarioFinal) {
  //     query.where.usuarioFinal = params.usuarioFinal;
  //   }

  //   if (params.accion) {
  //     query.where.accion = params.accion;
  //   }

  //   if (params.descripcion) {
  //     query.where.descripcion = params.descripcion;
  //   }

  //   if (params.estado) {
  //     query.where.estado = params.estado;
  //   }

    
  //   query.include = [];

  //   return derivacion.findAndCountAll(query);
  // }

  function findOne (params = {}) {
    const query = getQuery(params);
    query.attributes = [
      'id',
      'idUsuario',
      'idDerivacion',
      'tipo',
      'comentario',
      'vistoBueno',
      'createdAt'
    ];

    query.where = params;
    return derivacionVia.findOne(query);
  }

  return {
    // findAll,
    findOne,  
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, derivacionVia, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, derivacionVia, t),
    // tieneDerivacionesViaIncompletas
  };
};
