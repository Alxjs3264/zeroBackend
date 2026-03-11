'use strict';

const { getQuery, toJSON } = require('../../lib/util');
const Repository = require('../Repository');

module.exports = function modulossRepository (models, Sequelize) {
  const { permiso, menu, rol, aplicacion, usuario } = models;
  const Op = Sequelize.Op;

  async function findAll (params = {}) {
    const query = getQuery(params);
    query.where = {};
    query.distinct = true;

    query.attributes = [
      'id',
      'nombre',
      'descripcion',
      'tipo',
      'estado',
      'idMenu',
      'createdAt',
      [Sequelize.literal('(SELECT FALSE)'), 'permitido']
    ];

    query.include = [
      {
        attributes : [],
        required   : false,
        model      : rol,
        as         : 'roles'
      },
      {
        model : menu,
        as    : 'menu'
      }
    ];

    if (params.tipo) query.where.tipo = params.tipo;

    if (params.idRol) {
      query.include[0].required = true;
      query.include[0].where = { id: params.idRol };
    }

    console.log('==========_DESDE_ROL_==========');
    console.log(query.include[0]);
    console.log('==========_DESDE_ROL_==========');

    const result = await permiso.findAndCountAll(query);
    return toJSON(result);
  }

  async function findOne (params) {
    const query = {};

    query.where = params;

    if (params.idRol) query.where.id = params.idRol;

    query.include = [
      {
        model : menu,
        as    : 'menu'
      }
    ];
    const result = await permiso.findOne(query);
    if (!result)  return null;
    return result.toJSON();
  }

  async function findByRoles (roles) {
    const query = {};

    query.where = {
      estado: 'ACTIVO'
    };

    query.attributes = [
      'id',
      'nombre',
      'descripcion',
      'estado'
    ];

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

    const result = await permiso.findAndCountAll(query);
    return toJSON(result);
  }

  async function verificarPermisos (params) {
    const query = {  attributes: ['id', 'nombre'] };

    query.where = {
      nombre: { [Op.in]: params.permisos }

    };

    query.include = [
      {
        required   : true,
        through    : { attributes: [] },
        attributes : ['id'],
        model      : rol,
        as         : 'roles',
        where      : {}
      }
    ];
    
    if (params.roles) {
      query.include[0].where.id = {
        [Op.in]: params.roles
      };
    }

    if (params.usuarios) {
      query.include[0].include = [
        {
          required   : true,
          attributes : ['id'],
          model      : usuario,
          as         : 'usuarios',
          where      : {}
        }
      ]
      if (params.usuarios.length > 0) {
        query.include[0].include[0].where.id = {
          [Op.in]: params.usuarios
        };
      }
    }

    const result = await permiso.findOne(query);
    if (!result) {
      return null;
    }
    return result.toJSON();
  }

  async function verificarPermisosAplicacion (params) {
    const query = {
      attributes: ['id']
    };
    query.where = { nombre: { [Op.in]: params.permisos }, tipo: 'INTEROPERABILIDAD' };

    query.include = [
      {
        required   : true,
        through    : { attributes: [] },
        attributes : [],
        model      : aplicacion,
        as         : 'aplicaciones',
        where      : {
          idEntidad : params.idEntidad,
          idUsuario : params.idUsuario
        }
      }
    ];

    const result = await permiso.findOne(query);
    if (!result) {
      return null;
    }
    return result.toJSON();
  }

  return {
    verificarPermisosAplicacion,
    findByRoles,
    verificarPermisos,
    findAll,
    findOne,
    findById       : (id) => Repository.findById(id, permiso),
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, permiso, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, permiso, t)
  };
};
