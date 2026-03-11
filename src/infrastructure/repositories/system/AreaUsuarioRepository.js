'use strict';

const Repository = require('../Repository');
const { getQuery, toJSON } = require('../../lib/util');

module.exports = function areaUsuarioRepository (models, Sequelize) {
  const { area, usuario, areaUsuario } = models;
  const Op = Sequelize.Op;

  function findAll (params = {}) {
    // const query = getQuery(params);
    const query = { where: {} };
    query.attributes = [
      'id',
      'idUsuario',
      'idArea',
    ];
    query.where = {};

    query.include = [
      {
        model        : area,
        as           : 'usuarios',
        attributes   : [
          'id',
          'nombreArea'
        ]
      },
      {
        model        : area,
        as           : 'usuarios',
        attributes   : [
          'id',
          'nombreArea'
        ]
      },
      {
        model   : usuario,
        as      : 'areas',
        attributes: [
          'id',
          'numeroDocumento',
          'nombres',
          'primerApellido',
          'segundoApellido',
          'estado'
        ],
      }
    ];

    if (params.nombreArea) {
      query.where.usuarioResponsable = params.usuarioResponsable;
    }
         
    if (params.id) {
      query.where.id = params.id;
    }


    return area.findAndCountAll(query);
  }

  function findOne (params = {}) {
    const query = getQuery(params);
    query.attributes = [
      'id',
      'nombreArea',
      'sigla',
      'usuarioResponsable',
      'estado',
    ];
    query.where = params;
    return area.findOne(query);
  }

  return {
    findAll,
    findOne,  
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, area, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, area, t)
  };
};
