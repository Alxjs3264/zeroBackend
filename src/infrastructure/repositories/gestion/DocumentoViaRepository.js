'use strict';

const Repository = require('../Repository');
const { getQuery, toJSON } = require('../../lib/util');

module.exports = function documentoViaRepository (models, Sequelize) {
  const { area, documento, documentoVia, usuario, flujoDocumental } = models;
  const Op = Sequelize.Op;

  function findAll (params = {}) {
    // const query = getQuery(params);
    const query = { where: {} };
    query.attributes = [
      'id',
      'idDocumento',
      'idUsuario'
    ];

    query.include = [
      {
        model      : documento,
        as         : 'via',
        attributes : [
          'id',
          'cite',
          'correlativo',
          'asunto',
          'firmado',
          'fechaEmitido',
          'fechaAceptado',
          'fechaCerrado',
          'nombrePlantilla',
          'estado'
        ],
        include: [
          {
            model      : usuario,
            attributes : [
              'id',
              'usuario',
              'nombres',
              'primerApellido',
              'segundoApellido',
              'estado'
            ],
            as: 'usuarioCreador'
          },
          {
            model      : usuario,
            attributes : [
              'id',
              'usuario',
              'nombres',
              'primerApellido',
              'segundoApellido',
              'numeroDocumento',
              'estado'
            ],
            as: 'usuarioRemitente'
          },
          {
            model      : flujoDocumental,
            as         : 'flujoDocumental',
            attributes : [
              'id',
              'codigoFlujo',
              'tipoFlujo',
              'etapaFlujo',
              'nroCopia',
              'idFlujoPadre',
              'estado'
            ]
          },
          {
            model      : usuario,
            as         : 'usuarioDestinatario',
            attributes : [
              'id',
              'numeroDocumento',
              'nombres',
              'primerApellido',
              'segundoApellido',
              'estado'
            ],
            include: {
              model      : area,
              as         : 'areas',
              attributes : [
                'id',
                'nombreArea'
              ]
            }
          },
          {
            model      : area,
            as         : 'areaDestino',
            attributes : [
              'id',
              'nombreArea'
            ]
          },
          {
            model      : documento,
            as         : 'documentoAntecesor',
            attributes : [
              'id',
              'cite',
              'estado'
            ]
          }
        ]
      },
      {
        model      : usuario,
        as         : 'esVia',
        attributes : [
          'id',
          'tipoDocumento',
          'numeroDocumento',
          'complemento',
          'usuario',
          'nombres',
          'primerApellido',
          'segundoApellido',
          'estado'
        ]
      }
    ];

    if (params.idDocumento) {
      query.where.idDocumento = params.idDocumento;
    }

    if (params.idUsuario) {
      query.where.idUsuario = params.idUsuario;
    }

    return documentoVia.findAndCountAll(query);
  }

  function findOne (params = {}) {
    const query = getQuery(params);

    query.where = params;
    return documentoVia.findOne(query);
  }

  return {
    findAll,
    findOne,
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, documentoVia, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, documentoVia, t)
  };
};
