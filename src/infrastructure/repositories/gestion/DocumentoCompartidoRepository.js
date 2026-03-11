'use strict';

const { documentoReducido } = require('../../../domain/lib/util');
const { getQuery, toJSON } = require('../../lib/util');
const Repository = require('../Repository');
const debug = require('debug')('app:Repository:Paso');

module.exports = function DocumentoCompartidoRepository (models, Sequelize) {
  const { DocumentoCompartido, usuario, documento } = models;
  const { Cargo } = models.planificacion;

  const Op = Sequelize.Op;

  async function findAll (params = {}) {
    const query = getQuery(params);
    query.where = {};

    query.include = [
      {
        required : true,
        model    : documento,
        as       : 'documento'
      },
      {
        required   : true,
        attributes : ['id', 'nombres', 'primerApellido', 'segundoApellido'],
        model      : usuario,
        as         : 'usuarioOrigen',
        include    : [
          {
            attributes : ['id', 'descripcion'],
            model      : Cargo,
            as         : 'cargoUsuario'
          }
        ]

      }
    ];

    if (params.idDocumento) query.where.idDocumento = params.idDocumento;

    if (params.idUsuario) query.where.idUsuario = params.idUsuario;

    if (params.idUsuarioOrigen) query.where.idUsuarioOrigen = params.idUsuarioOrigen;

    if (params.noAprobado) query.where.aprobado = false;

    const result = await DocumentoCompartido.findAndCountAll(query);
    return toJSON(result);
  }

  async function findOne (params = {}) {
    const query = {};
    query.where = params;

    query.include = [
      {
        required : true,
        model    : documento,
        as       : 'documento'
      },
      {
        required   : true,
        attributes : ['id', 'nombres', 'primerApellido', 'segundoApellido'],
        model      : usuario,
        as         : 'usuarioOrigen',
        include    : [
          {
            attributes : ['id', 'descripcion'],
            model      : Cargo,
            as         : 'cargoUsuario'
          }
        ]

      }
    ];
    const result = await DocumentoCompartido.findOne(query);

    if (result) {
      return result.toJSON();
    }

    return null;
  }

  async function eliminarOtros (params = {}, t) {
    const query = {};
    query.where = {};

    if (params.idsValidos) {
      query.where.id = { [Op.notIn]: params.idsValidos };
    }

    if (params.idDocumento) {
      query.where.idDocumento = params.idDocumento;
    }

    if (t) query.transaction = t;

    const result = await DocumentoCompartido.update({ userDeleted: params.userDeleted, deletedAt: new Date() }, query);
    return result;
  }

  return {
    eliminarOtros,
    findAll,
    findOne,
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, DocumentoCompartido, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, DocumentoCompartido, t),
    deleteItemCond : (params, t) => Repository.deleteItemCond(params, DocumentoCompartido, t)
  };
};
