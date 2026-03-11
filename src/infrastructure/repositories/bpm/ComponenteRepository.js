'use strict';

const { getQuery, toJSON } = require('../../lib/util');
const Repository = require('../Repository');

module.exports = function componenteRepository (models, Sequelize) {
  const { componente, rol, permisos, rolMenu } = models;
  const Op = Sequelize.Op;

  function findAll (params = {}) {
    const query = getQuery(params);
    query.attributes = [
      'id',
      'nombre',
      'descripcion',
      'icono',
      'estado',
      'tipo',
      'configuracion_json'
    ];

    query.where = {};
    query.include = [];

    if (params.id) {
      query.where.id = params.id;
    }

    if (params.tipo) {
      query.where.tipo = params.tipo;
    }

    if (params.nombre) {
      query.where.nombre = {
        [Op.iLike]: `%${params.nombre}%`
      };
    }

    return componente.findAndCountAll(query);
  }

  function findOne (params = {}) {
    const query = getQuery(params);
    query.attributes = [
      'id',
      'nombre',
      'descripcion',
      'icono',
      'estado',
      'tipo',
      'configuracion_json'
    ];
    query.where = {};
    if (params.id) {
      query.where.id = params.id;
    }
    return componente.findOne(query);
  }

  return {
    findAll,
    findOne,
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, componente, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, componente, t)
  };
};
