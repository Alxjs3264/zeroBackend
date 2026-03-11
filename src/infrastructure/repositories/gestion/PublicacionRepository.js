'use strict';

const { getQuery, toJSON } = require('../../lib/util');
const Repository = require('../Repository');
const debug = require('debug')('app:Repository:Paso');

module.exports = function PublicacionRepository (models, Sequelize) {
  const { Publicacion, usuario, parametro } = models;
  const Op = Sequelize.Op;

  async function findAll (params = {}) {
    debug(params);
    const query = getQuery(params);

    query.where = {};

    if (params.estado) {
      query.where.estado = params.estado;
    }

    if (params.idArea) {
      query.where[Op.or] = [
        {
          areas: {
            [Op.iLike]: `%${params.idArea}%`
          }
        },
        { areas: null }
      ];
    }

    query.include = [
      {
        model : usuario,
        as    : 'usuarioPublicacion'
      }, {
        attributes: [
          'id',
          'codigo',
          'nombre',
          'grupo'
        ],
        model : parametro,
        as    : 'categoria'
      }
    ];

    if (params.idCategoria) {
      query.where.idCategoria = { [Op.in]: params.idCategoria };
    }

    if (params.idUsuario) {
      if (Array.isArray(params.idUsuario)) {
        query.where.idUsuario = {
          [Op.in]: params.idUsuario
        };
      } else {
        query.where.idUsuario = params.idUsuario;
      }
    }

    if (params.fechaDesde && params.fechaHasta) {
      query.where.createdAt = {
        [Op.gte]: `${params.fechaDesde} 00:00:00`,
        [Op.lte]: `${params.fechaHasta} 23:59:59`
      };
    }

    const result = await Publicacion.findAndCountAll(query);
    return toJSON(result);
  }

  async function findOne (params = {}) {
    const query = {};
    query.where = params;

    const result = await Publicacion.findOne(query);

    if (result) {
      return result.toJSON();
    }

    return null;
  }

  return {
    findAll,
    findOne,
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, Publicacion, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, Publicacion, t),
    deleteItemCond : (params, t) => Repository.deleteItemCond(params, Publicacion, t)
  };
};
