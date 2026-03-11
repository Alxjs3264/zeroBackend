'use strict';

const Repository = require('../Repository');
const { getQuery, toJSON } = require('../../lib/util');

module.exports = function archivoAdjuntoRepository (models, Sequelize) {
  const { archivoAdjunto, documento, derivacion, derivacionVia, usuario } = models;
  const Op = Sequelize.Op;

  const attributes = [
    'id',
    'idDocumento',
    'ruta',
    'nombre',
    'extension',
    'userCreated',
    'userUpdated',
    'updatedAt',
    'createdAt',
    'editable'
  ];

  async function findAll (params = {}) {
    const query = getQuery(params);
    query.where = {};

    query.attributes = attributes;

    query.include = [
      {
        attributes: [
          'id',
          'nombres',
          'primerApellido',
          'segundoApellido'
        ],
        model : usuario,
        as    : 'usuarioCreacion'
      },
      {
        attributes: [
          'id',
          'nombres',
          'primerApellido',
          'segundoApellido'
        ],
        model : usuario,
        as    : 'usuarioActualizacion'
      }
    ];

    query.where = {};
    if (params.idDocumento) {
      query.where.idDocumento = params.idDocumento;
    }

    const result = await archivoAdjunto.findAndCountAll(query);
    return toJSON(result);
  }

  function findOne (params = {}) {
    const query = getQuery(params);
    query.attributes = [
      'id',
      'idDocumento',
      'idDerivacion',
      'idDerivacionVia',
      'ruta',
      'nombre',
      'prefijo',
      'extension',
      'editable'
    ];

    query.include = [
      {
        model      : documento,
        as         : 'documento',
        attributes : [
          'id',
          'remitenteDe',
          'destinatarioEspecifico',
          'correlativo',
          'siglaAreaRemitente',
          'cite',
          'asunto',
          'clasificacion',
          'estado'
        ]
      },
      {
        model      : derivacion,
        as         : 'derivacion',
        attributes : [
          'id',
          'idDocumento',
          'usuarioInicial',
          'usuarioFinal',
          'accion',
          'descripcion',
          'numero',
          'completada'
        ]
      },
      {
        model      : derivacionVia,
        as         : 'derivacionVia',
        attributes : [
          'id',
          'idUsuario',
          'tipo',
          'comentario',
          'vistoBueno'
        ]
      }
    ];

    query.where = params;
    return archivoAdjunto.findOne(query);
  }

  return {
    findAll,
    findOne,
    findById       : id => Repository.findById(id, archivoAdjunto, attributes),
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, archivoAdjunto, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, archivoAdjunto, t)
  };
};
