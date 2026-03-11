'use strict';

const { getQuery, toJSON } = require('../../lib/util');
const Repository = require('../Repository');

module.exports = function menusRepository (models, Sequelize) {
  const { menu, rol, permiso } = models;
  const Op = Sequelize.Op;

  async function findAll (params = {}) {
    const query = getQuery(params);
    query.attributes = [
      'id',
      'nombre',
      'ruta',
      'icono',
      'idMenu',
      'orden',
      'esMenu',
      'estado',
      'createdAt'
    ];

    query.where = {};

    query.include = [
      { model: menu, as: 'menuPadre' },
      {
        attributes: [
          'id',
          'descripcion',
          'estado',
          'tipo',
          'idMenu',
          'nombre'
        ],
        required : false,
        model    : permiso,
        as       : 'permisos'
      }
    ];

    if (params.tipoPermiso) query.include[1].where = { tipo: params.tipoPermiso };

    if (params.estado) query.where.estado = params.estado;
    if (params.tipo) query.where.tipo = params.tipo;
    if (params.nombre) query.where.nombre = { [Op.iLike]: `%${params.nombre}%` };

    const result = await menu.findAndCountAll(query);
    return toJSON(result);
  }

  function findOne (params = {}) {
    const query = {};
    query.where = params;
    query.include = [];
    return menu.findOne(query);
  }

  async function findByRoles (roles) {
    const query = {};
    query.where = {
      estado: 'ACTIVO'
    };

    query.attributes = [
      'id',
      'nombre',
      'ruta',
      'icono',
      'idMenu',
      'orden',
      'estado'
    ];

    query.order = [['orden', 'ASC']];

    query.include = [
      {
        required   : true,
        through    : { attributes: [] },
        attributes : [],
        model      : rol,
        as         : 'roles',
        where      : {
          id: {
            [Op.in]: roles
          }
        }
      }
    ];

    const result = await menu.findAndCountAll(query);
    return toJSON(result);
  }

  return {
    findAll,
    findByRoles,
    findOne,
    findById       : (id) => Repository.findById(id, menu),
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, menu, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, menu, t)
  };
};
