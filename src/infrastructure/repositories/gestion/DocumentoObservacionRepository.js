'use strict';

const { documentoReducido } = require('../../../domain/lib/util');
const { getQuery, toJSON } = require('../../lib/util');
const Repository = require('../Repository');
const debug = require('debug')('app:Repository:Paso');

module.exports = function DocumentoObservacionRepository (models, Sequelize) {
  const { DocumentoObservacion, usuario, documento, flujoDerivacion } = models;
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
        model    : usuario,
        as       : 'revisor',
        include  : [
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
            model : Cargo,
            as    : 'cargoUsuario'
          },
        ]
      }
    ];

    if (params.idDocumento) query.where.idDocumento = params.idDocumento;

    if (params.idFlujoDocumental) query.include[0].where = { idFlujo: params.idFlujoDocumental };

    if (params.idUsuarioRevisor) query.where.idUsuarioRevisor = params.idUsuarioRevisor;
    
    if (params.idUsuarioObservado) query.where.idUsuarioObservado = params.idUsuarioObservado;

    if (params.idDerivacionOrigen) query.where.idDerivacionOrigen = params.idDerivacionOrigen;

    if ('corregido' in params) query.where.corregido = params.corregido;

    const result = await DocumentoObservacion.findAndCountAll(query);
    return toJSON(result);
  }

  async function findOne (params = {}) {
    const query = {};
    query.order = [['createdAt', 'DESC']];
    query.where = params;

    query.include = [
      {
        required : true,
        model    : documento,
        as       : 'documento'
      },
      {
        model    : usuario,
        as       : 'revisor',
        include  : [
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
            model : Cargo,
            as    : 'cargoUsuario'
          },
        ]
      }
    ];
    const result = await DocumentoObservacion.findOne(query);

    if (result) {
      return result.toJSON();
    }

    return null;
  }

  return {
    findAll,
    findOne,
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, DocumentoObservacion, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, DocumentoObservacion, t),
    deleteItemCond : (params, t) => Repository.deleteItemCond(params, DocumentoObservacion, t)
  };
};
