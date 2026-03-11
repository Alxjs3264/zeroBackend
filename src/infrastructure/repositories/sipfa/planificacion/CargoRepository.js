'use strict';

const Repository = require('../../Repository');
// const { getQuery, toJSON } = require('../../../lib/util');
const { getQuery, errorHandler, toJSON } = require('../../../lib/util');

module.exports = function CargoRepository (models, Sequelize) {
  const { Cargo, ConfiguracionCargo } = models.planificacion;
  const { area, parametro, usuario } = models;

  const Op = Sequelize.Op;

  function findAll (params = {}) {
    params.order = 'nroItem';
    const query = getQuery(params);

    query.attributes = [
      'id',
      'nroItem',
      'descripcion',
      'idTipoPuesto',
      'estado',
      'interno',
      'nivel'
    ];
    query.include = [
      {
        attributes : ['id', 'nombres', 'primerApellido', 'segundoApellido'],
        model      : usuario
      },
      {
        model : parametro,
        as    : 'tipoPuesto'
      },
      {
        model : ConfiguracionCargo,
        as    : 'configuracionCargos'
      }
    ];

    query.where = {};

    if (params.id) query.where.id = params.id;

    if (params.nroItem) query.where.nroItem = params.nroItem;

    if (params.idTipoPuesto) query.where.idTipoPuesto = params.idTipoPuesto;

    if (params.idNivelCategoria) query.where.idNivelCategoria = params.idNivelCategoria;

    if (params.reformulacionHabilitada) query.where.reformulacionHabilitada = params.reformulacionHabilitada;

    if (params.idEscalaSalarial) query.where.idEscalaSalarial = params.idEscalaSalarial;

    if (params.funcionario) {
      query.include[0].where = {
        [Op.or]: [
          { nombres: {  [Op.iLike]: `%${params.funcionario}%` } },
          { primerApellido: {  [Op.iLike]: `%${params.funcionario}%` } },
          { segundoApellido: {  [Op.iLike]: `%${params.funcionario}%` } }
        ]
      };
    }

    if (params.tipo) query.include[1].where = { nombre: {  [Op.iLike]: `%${params.tipo}%` } };

    if (params.nivel) query.where.nivel = params.nivel;

    if (params.interno) query.where.interno = params.interno;

    if (params.objetivoPuesto) query.where.objetivoPuesto = { [Op.iLike]: `%${params.objetivoPuesto}%` };

    if (params.descripcion) query.where.descripcion = { [Op.iLike]: `%${params.descripcion}%` };

    if (params.idArea) query.where.idUnidadOrganizacional = params.idArea;

    if (params.idEntidad) {
      query.include.push({
        model : area,
        as    : 'unidad',
        where : { idEntidad: params.idEntidad }
      });
    }

    return Cargo.findAndCountAll(query);
  }

  async function findOne (params = {}) {
    const query = { where: params };
    query.attributes = [
      'id',
      'nroItem',
      'descripcion',
      'estado',
      'idUnidadOrganizacional',
      'nivel',
      'ciudadano',
      'idTipoPuesto',
      'interno',
      'ciudad',
      'createdAt'
    ];
    query.include = [
      {
        model : ConfiguracionCargo,
        as    : 'configuracionCargos'
      },
      {
        model : area,
        as    : 'unidad'
      }
    ];

    const result = await Cargo.findOne(query);
    if (!result) {
      return null;
    }
    return result.toJSON();
  }

  async function existe ({ id, nroItem, idUnidadOrganizacional }) {
    const query = {
      where: {}
    };

    if (id) query.where.id = { [Op.ne]: id };

    if (nroItem && idUnidadOrganizacional) {
      query.where.nroItem = nroItem;
      query.where.idUnidadOrganizacional = idUnidadOrganizacional;
    }

    const result = await Cargo.findOne(query);

    if (result) return result.toJSON();

    return null;
  }

  return {
    existe,
    findAll,
    findOne,
    // createOrUpdate,
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, Cargo, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, Cargo, t)
  };
};
