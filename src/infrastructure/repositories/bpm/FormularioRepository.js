'use strict';

const { getQuery, toJSON } = require('../../lib/util');
const Repository = require('../Repository');
const debug = require('debug')('app:Repository:Formulario');

// const attributesFormulario = [
//   'id',
//   'nombre',
//   'descripcion',
//   'configuracion_json',
//   'sigla',
//   'anual',
//   'tipo',
//   'estado',
//   'createdAt'
// ];

module.exports = function formularioRepository (models, Sequelize) {
  const { formulario, usuario, parametro, entidad, area } = models;
  const Op = Sequelize.Op;

  async function findAll (params = {}) {
    const query = getQuery(params);
    query.attributes = [
      'id',
      'nombre',
      'descripcion',
      'sigla',
      'anual',
      'tipo',
      'estado',
      'idCategoria',
      'habilitarPalabrasClave',
      'createdAt',
      'pertenece_flujo'
    ]; ;
    query.where = {};

    query.include = [
      {
        model      : usuario,
        as         : 'usuarioCreacion',
        attributes : ['usuario']
      },
      {
        model      : parametro,
        as         : 'categoria',
        attributes : ['id', 'nombre', 'codigo']
      },
      {
        attributes : [],
        through    : { attributes: [] },
        model      : entidad,
        as         : 'entidadesFormulario'
      },
      {
        attributes : [],
        through    : { attributes: [] },
        model      : area,
        as         : 'areasFormulario'
      }
    ];

    if (params.id) {
      query.where.id = params.id;
      if (Array.isArray(params.id)) {
        query.where.id = {
          [Op.in]: params.id
        };
      }
    }

    if (params.ids) {
      params.ids = params.ids.split(',');
      query.where.id = {
        [Op.in]: params.ids
      };
    }

    if (params.idArea) query.where[Op.or] = [{ idArea: params.idArea }, { idArea: null }];

    if (params.id_entidad) query.where.id_entidad = params.id_entidad;
    if (params.tipo) query.where.tipo = params.tipo;
    if (params.estado) query.where.estado = params.estado;
    if (params.nombre) query.where.nombre = { [Op.iLike]: `%${params.nombre}%` };
    if (params.descripcion) query.where.descripcion = { [Op.iLike]: `%${params.descripcion}%` };

    if (params.filtrosEntidad) {
      query.where[Op.or] = [
        { '$entidadesFormulario.id$': Array.isArray(params.idEntidad) ? { [Op.in]: params.idEntidad } : params.idEntidad },
        { '$areasFormulario.id$': Array.isArray(params.idAreas) ? { [Op.in]: params.idAreas } : params.idAreas }
      ];
    }

    const result = await formulario.findAndCountAll(query);
    return toJSON(result);
  }

  async function findAllComplete (params = {}) {
    const query = { where: {} };

    if (params.id) {
      query.where.id = params.id;
      if (Array.isArray(params.id)) {
        query.where.id = {
          [Op.in]: params.id
        };
      }
    }

    const result = await formulario.findAndCountAll(query);
    return toJSON(result);
  }

  function findListAll (params = {}) {
    const query = getQuery(params);
    query.attributes = [
      'id',
      'nombre',
      'descripcion',
      'sigla',
      'anual',
    ];
    query.where = {};

    query.include = [
    ];

    if (params.id) {
      query.where.id = params.id;
    }

    if (params.ids) {
      params.ids = params.ids.split(',');
      query.where.id = {
        [Op.in]: params.ids
      };
    }

    if (params.id_entidad) {
      query.where.id_entidad = params.id_entidad;
    }

    if (params.nombre) {
      query.where.nombre = {
        [Op.iLike]: `%${params.nombre}%`
      };
    }

    return formulario.findAndCountAll(query);
  }

  async function findOne (params = {}) {
    const query = {};
    query.where = params;

    const result = await formulario.findOne(query);

    if (result) {
      return result.toJSON();
    }

    return null;
  }

  return {
    findAllComplete,
    findAll,
    findListAll,
    findOne,
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, formulario, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, formulario, t)
  };
};
