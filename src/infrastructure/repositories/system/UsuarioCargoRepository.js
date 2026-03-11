'use strict';

const { getQuery, toJSON } = require('../../lib/util');
const Repository = require('../Repository');

module.exports = function usuariosServicioRepository (models, Sequelize) {
  const { usuarioCargo, usuario, area, entidad } = models;
  const { Cargo, ConfiguracionCargo } = models.planificacion;
  const Op = Sequelize.Op;

  async function findAll (params = {}) {
    const query = getQuery(params);

    query.where = {};

    query.attributes = [
      'id',
      'estado',
      'idCargo',
      'idUsuario'
    ];

    query.include = [
      {
        attributes: [
          'id',
          'nroItem',
          'descripcion',
          'idTipoPuesto',
          'nivel',
          'estado',
          'interno',
          'idUnidadOrganizacional'
        ],
        include: [
          {
            model      : area,
            as         : 'unidad',
            attributes : [
              'estado',
              'id',
              'nombreArea',
              'sigla'
            ]
          }
        ],
        model : Cargo,
        as    : 'cargo',
        where : {}
      },
      {
        attributes: [
          'id',
          'idEntidad',
          'tipoDocumento',
          'numeroDocumento',
          'complemento',
          'fechaNacimiento',
          'usuario',
          'nombres',
          'primerApellido',
          'segundoApellido',
          'telefono',
          'celular',
          'correoElectronico',
          'cargo',
          'idCargo',
          'foto',
          'estado'
        ],
        model   : usuario,
        as      : 'usuario',
        include : [
          {
            model      : entidad,
            as         : 'entidad',
            attributes : [
              'id',
              'codigo',
              'nombre',
              'sigla'
            ]
          }
        ]
      }
    ];

    if (params.idEntidad) {
      if (query.include[1].where) query.include[1].where.idEntidad = params.idEntidad;
      if (!query.include[1].where) query.include[1].where = { idEntidad: params.idEntidad };
    }

    if (params.numeroDocumento) {
      let numeroDocumento = params.numeroDocumento;
      let complemento = null;

      if (numeroDocumento.includes('-')) ([numeroDocumento, complemento] = numeroDocumento.split('-'));

      if (query.include[1].where) query.include[1].where.numeroDocumento = numeroDocumento;
      if (!query.include[1].where) query.include[1].where = { numeroDocumento };

      if (complemento) query.include[1].where.complemento = complemento;
    }

    if (params.idCargo) {
      query.where.idCargo = params.idCargo;
      if (Array.isArray(params.idCargo)) {
        query.where.idCargo = {
          [Op.in]: params.idCargo
        };
      }
    }

    if (params.nivel) {
      query.include[0].where.nivel = params.nivel;
    }

    if (params.idUsuario) {
      query.paranoid = false;
      query.where.idUsuario = params.idUsuario;

      if (Array.isArray(params.idUsuario)) query.where.idUsuario = { [Op.in]: params.idUsuario };
    }

    if (params.exclude) {
      query.where.idUsuario = {
        [Op.notIn]: Array.isArray(params.exclude) ? params.exclude : [params.exclude]
      };
    }

    if (params.idArea) query.include[0].where = { idUnidadOrganizacional: params.idArea };

    if (params.excludeIdTipoPuesto) {
      if (query.include[0].where) { query.include[0].where.idTipoPuesto = { [Op.notIn]: [params.excludeIdTipoPuesto] }; };
      if (!query.include[0].where) query.include[0].where = { idTipoPuesto: { [Op.notIn]: [params.excludeIdTipoPuesto] } };
    }

    if (params.estado) {
      if (query.include[0].where) query.include[0].where.estado = params.estado;
      if (!query.include[0].where) query.include[0].where = { estado: params.estado };

      if (query.include[1].where) query.include[1].where.estado = params.estado;
      if (!query.include[1].where) query.include[1].where = { estado: params.estado };

      query.where.estado = params.estado;
    }

    const result = await usuarioCargo.findAndCountAll(query);
    return toJSON(result);
  }

  async function findDependientes (params = {}) {
    const query = getQuery(params);
    query.where = {};
    query.attributes = [
      'id',
      'estado',
      'idCargo',
      'idUsuario'
    ];

    query.include = [
      {
        attributes: [
          'id',
          'nroItem',
          'descripcion',
          'idTipoPuesto',
          'nivel',
          'estado',
          'idUnidadOrganizacional'
        ],
        model   : Cargo,
        as      : 'cargo',
        include : [
          {
            model : ConfiguracionCargo,
            as    : 'configuracionCargos'
          }
        ]
      },
      {
        attributes: [
          'id',
          'idEntidad',
          'tipoDocumento',
          'numeroDocumento',
          'complemento',
          'fechaNacimiento',
          'usuario',
          'nombres',
          'primerApellido',
          'segundoApellido',
          'telefono',
          'celular',
          'correoElectronico',
          'cargo',
          'idCargo',
          'foto',
          'estado'
        ],
        model : usuario,
        as    : 'usuario'
      }
    ];

    if (params.idDepenenciaLinea) {
      query.include[0].required = true;
      query.include[0].include[0].required = true;
      query.include[0].include[0].where = { idDepenenciaLinea: params.idDepenenciaLinea };
    }

    const result = await usuarioCargo.findAndCountAll(query);
    return toJSON(result);
  }

  return {
    findAll,
    findOne        : params => Repository.findOne(params, usuarioCargo),
    findById       : id => Repository.findById(id, usuarioCargo),
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, usuarioCargo, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, usuarioCargo, t),
    deleteItemCond : (params, t) => Repository.deleteItemCond(params, usuarioCargo, t),
    findDependientes
  };
};
