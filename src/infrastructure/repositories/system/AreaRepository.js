'use strict';

const Repository = require('../Repository');
const { getQuery, toJSON } = require('../../lib/util');

module.exports = function areaRepository (models, Sequelize) {
  const { area, usuario, entidad } = models;
  const Op = Sequelize.Op;

  async function findAll (params = {}) {
    const query = getQuery(params);
    query.attributes = [
      'id',
      'nombre_area',
      'sigla',
      'idEntidad',
      'tipoHeader',
      'tipoFooter',
      'usuario_responsable',
      'estado'
    ];
    query.where = {};

    if (params.search) {
      query.where = {
        ...query.where,
        ...{
          [Op.or]: [
            {
              nombreArea: {
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

    if (params.usuarioResponsable) query.where.usuarioResponsable = params.usuarioResponsable;

    if (params.id) query.where.id = params.id;

    if (params.estado) query.where.estado = params.estado;

    if (params.sigla) query.where.sigla = { [Op.iLike]: `%${params.sigla}%` };

    if (params.nombre) query.where.nombreArea = { [Op.iLike]: `%${params.nombre}%` }; ;

    if (params.idEntidad) query.where.idEntidad = params.idEntidad;

    query.include = [
      {
        attributes: [
          'id',
          'tipoDocumento',
          'numeroDocumento',
          'complemento',
          'fechaNacimiento',
          'usuario',
          'contrasena',
          'nombres',
          'primerApellido',
          'segundoApellido',
          'telefono',
          'celular',
          'correoElectronico',
          'cargo',
          'idCargo'
        ],
        model : usuario,
        as    : 'usuarioResponsableArea'
      },
      {
        attributes: [
          'id',
          'codigo',
          'nombre',
          'descripcion',
          'sigla',
          'email',
          'web',
          'direccion',
          'telefono',
          'estado'
        ],
        model : entidad,
        as    : 'entidad'
      }
    ];

    const result = await area.findAndCountAll(query);
    return toJSON(result);
  }

  async function findOne (params = {}) {
    const query = {};
    query.attributes = [
      'id',
      'nombreArea',
      'sigla',
      'idEntidad',
      'usuarioResponsable',
      'tipoHeader',
      'tipoFooter',
      'contenidoHeader',
      'contenidoFooter',
      'estado'
    ];
    query.where = params;
    const result = await area.findOne(query);
    if (!result) {
      return null;
    }
    return result.toJSON();
  }

  async function update (condicion = {}, valores = {}, t = null) {
    const query = {};

    if (t) query.transaction = t;

    query.where = condicion;

    valores.updatedAt = new Date();

    const result = await area.update(valores, query);

    if (!result) return null;

    return result;
  }

  async function existe ({ id, idEntidad, nombreArea, sigla }) {
    const query = {
      where: {}
    };

    if (id) query.where.id = { [Op.ne]: id };

    if (idEntidad && nombreArea && sigla) {
      if (nombreArea) {
        query.where.idEntidad = idEntidad;
        query.where.nombreArea = nombreArea;
        query.where.sigla = sigla;
      }
    }

    const result = await area.findOne(query);

    if (result) return result.toJSON();

    return null;
  }

  return {
    existe,
    update,
    findAll,
    findOne,
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, area, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, area, t)
  };
};
