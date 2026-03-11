'use strict';

const Repository = require('../Repository');
const { getQuery, toJSON } = require('../../lib/util');

module.exports = function entidadRepository (models, Sequelize) {
  const { entidad, usuario } = models;
  const Op = Sequelize.Op;

  function findAll (params = {}) {
    const query = getQuery(params);
    query.attributes = [
      'id',
      'codigo',
      'nombre',
      'descripcion',
      'sigla',
      'web',
      'email',
      'direccion',
      'telefono',
      'estado',
      'nivel',
      'idEntidad'
    ];

    query.where = {};

    if (params.search) {
      query.where = {
        ...query.where,
        ...{
          [Op.or]: [
            {
              nombre: {
                [Op.iLike]: `%${params.search}%`
              }
            },
            {
              sigla: {
                [Op.iLike]: `%${params.search}%`
              }
            }
          ]
        }
      };
    }

    if (params.nombre) query.where.nombre = { [Op.iLike]: `%${params.nombre}%` };

    if (params.sigla) query.where.sigla = { [Op.iLike]: `%${params.sigla}%` };

    if (params.codigo) query.where.codigo = params.codigo;

    if (params.email) query.where.email = { [Op.iLike]: `%${params.email}%` };

    if (params.nivel) query.where.nivel = params.nivel;
    if (params.id) query.where.id = params.id;
    if (params.idEntidad) query.where.id = params.idEntidad;

    query.include = [];

    return entidad.findAndCountAll(query);
  }

  async function findDependientes (entidades, nivel) {
    const query = {
      attributes: [
        'id',
        'codigo',
        'nombre',
        'descripcion',
        'sigla',
        'web',
        'email',
        'direccion',
        'telefono',
        'estado',
        'nivel',
        'idEntidad'
      ],
      where: {
        idEntidad: {
          [Op.in]: entidades
        },
        nivel
      }
    };
    const result = await entidad.findAndCountAll(query);
    return toJSON(result);
  }

  async function getSuperiores (id, entidadesSuperiores) {
    const query = {};

    query.where = { id };
    query.include  = [
      {
        attributes: [
          'id',
          'idEntidad',
          'codigo',
          'nivel',
          'nombre',
          'sigla'
        ],
        model : entidad,
        as    : 'entidadPadre'
      }
    ];

    let resultado = await entidad.findOne(query);
    if (resultado) {
      resultado =  resultado.toJSON();
      if (resultado.entidadPadre) {
        entidadesSuperiores.push(resultado.entidadPadre);
        return getSuperiores(resultado.entidadPadre.id, entidadesSuperiores);
      }
    }
    return entidadesSuperiores;
  }

  async function findOne (params = {}) {
    const query = params;
    query.attributes = [
      'id',
      'codigo',
      'nombre',
      'descripcion',
      'sigla',
      'web',
      'email',
      'direccion',
      'telefono',
      'estado',
      'nivel',
      'idEntidad'
    ];
    query.where = {};

    query.include = [
      {
        through    : { attributes: ['id', 'idEntidad', 'idUsuario', 'idFuncion'] },
        attributes : [
          'id',
          'nombres',
          'primerApellido',
          'segundoApellido',
          'idCargo',
          'cargo'
        ],
        model : usuario,
        as    : 'funcionarios'
      }
    ];

    if (params.id) query.where.id = params.id;

    if (params.codigo) query.where.codigo = params.codigo;

    if (params.sigla) query.where.sigla = params.sigla;

    const result = await entidad.findOne(query);

    if (result) return result.toJSON();

    return null;
  }

  async function existe ({ id, nombre, codigo, sigla }) {
    const query = {
      where: {
        [Op.or]: []
      }
    };

    if (id) query.where.id = { [Op.ne]: id };

    if (nombre) query.where[Op.or].push({ nombre });

    if (codigo) query.where[Op.or].push({ codigo });

    if (sigla) query.where[Op.or].push({ sigla });

    const result = await entidad.findOne(query);

    if (result) return result.toJSON();

    return null;
  }

  return {
    existe,
    getSuperiores,
    findDependientes,
    findAll,
    findOne,
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, entidad, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, entidad, t)
  };
};
