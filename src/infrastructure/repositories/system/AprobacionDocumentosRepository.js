'use strict';

const Repository = require('../Repository');
const { getQuery, toJSON } = require('../../lib/util');

module.exports = function AprobacionRepository (models, Sequelize) {
  const { aprobacionDocumentos, usuario, documento, flujoDocumental, SolicitudPlantilla } = models;
  const Op = Sequelize.Op;

  async function pendientesFirma (params = {}) {
    const query = getQuery(params);

    query.include = [
      {
        attributes: [
          'id',
          'cite',
          'asunto',
          [Sequelize.json('plantilla.nombre'), 'nombrePlantilla']
        ],
        model : documento,
        as    : 'documentoAprobado'
      },
      {
        attributes: [
          'id',
          'codigoFlujo',
          'copia',
          'tipo',
          'estado',
          'concluido',
          'referencia'
        ],
        model   : flujoDocumental,
        as      : 'flujoDocumental',
        include : [
          {
            attributes : ['id', 'nombre', 'descripcion', 'codigo'],
            model      : SolicitudPlantilla,
            as         : 'solicitudPlantilla'
          }
        ]
      }
    ];

    query.where = {
      idUsuario : params.idUsuarioDestinatario,
      [Op.not]  : { idFlujo: null },
      [Op.or]   : [{ aceptado: false }, { introducido: false }]
    };

    const result = await aprobacionDocumentos.findAndCountAll(query);
    return toJSON(result);
  }

  async function findAll (params = {}) {
    const query = getQuery(params);
    query.attributes = [
      'id',
      'tramite',
      'url_redireccion',
      'aceptado',
      'introducido',
      'codigo_operacion',
      'transaction_id',
      'fecha_hora_solicitud',
      'hash_datos',
      'ci',
      'descripcion',
      'nombre_archivo',
      'urlRedireccionCliente',
      'idUsuario',
      'updatedAt'
    ];

    query.where = {};

    if (params.tramite) {
      query.where.tramite = params.tramite;
    }

    if (params.idDocumento) {
      query.where.idDocumento = params.idDocumento;
    }

    if ('aceptado' in params) {
      query.where.aceptado = params.aceptado;
    }

    if ('introducido' in params) {
      query.where.introducido = params.introducido;
    }

    if (params.idUsuario) {
      query.where.idUsuario = params.idUsuario;
    }

    query.include = [
      {
        attributes : ['nombres', 'primerApellido', 'segundoApellido', 'cargo', 'foto', 'numeroDocumento'],
        model      : usuario,
        as         : 'usuario'
      }
    ];

    const result = await aprobacionDocumentos.findAndCountAll(query);
    return toJSON(result);
  }

  /**
   * Busca el registro dados los parámetros
   * @param params (object) Campos para buscar pueden ser, id, idSolicitud, nombreArchivo, ci, etc.
   */
  async function findOne (params = {}) {
    const query = { where: {} };
    query.order = [['createdAt', 'DESC']];
    query.where = { ...params };
    query.attributes = [
      'id',
      'tramite',
      'idDocumento',
      'idUsuario',
      'url_redireccion',
      'aceptado',
      'introducido',
      'codigo_operacion',
      'transaction_id',
      'fecha_hora_solicitud',
      'hash_datos',
      'ci',
      'descripcion',
      'nombre_archivo',
      'accion'
    ];
    query.include = [
      {
        model      : usuario,
        as         : 'usuario',
        attributes : [
          'id',
          'usuario',
          'cargo',
          'estado'
        ]
      },
      {
        model      : documento,
        as         : 'documentoAprobado',
        attributes : [
          'id',
          'idFlujo',
          'remitenteDe',
          'destinatarioEspecifico',
          'destinatarioArea',
          'cite',
          'asunto',
          'clasificacion',
          'firmado'
        ]
      }
    ];

    const result = await aprobacionDocumentos.findOne(query);

    if (result) {
      return result.toJSON();
    }
    return null;
  }

  async function buscarPendiente (idFlujo) {
    const query = { where: {} };
    query.order = [['createdAt', 'DESC']];
    query.where = {
      idFlujo,
      [Op.or]: [{ aceptado: false }, { introducido: false }]
    };

    query.attributes = [
      'id',
      'tramite',
      'idDocumento',
      'idUsuario',
      'url_redireccion',
      'aceptado',
      'introducido',
      'codigo_operacion',
      'transaction_id',
      'fecha_hora_solicitud',
      'hash_datos',
      'ci',
      'descripcion',
      'nombre_archivo',
      'accion'
    ];
    query.include = [
      {
        model      : usuario,
        as         : 'usuario',
        attributes : [
          'id',
          'usuario',
          'cargo',
          'estado'
        ]
      },
      {
        model      : documento,
        as         : 'documentoAprobado',
        attributes : [
          'id',
          'idFlujo',
          'remitenteDe',
          'destinatarioEspecifico',
          'destinatarioArea',
          'cite',
          'asunto',
          'clasificacion',
          'firmado'
        ]
      }
    ];

    const result = await aprobacionDocumentos.findOne(query);

    if (result) {
      return result.toJSON();
    }
    return null;
  }

  return {
    buscarPendiente,
    pendientesFirma,
    findAll,
    findOne,
    deleteItemCond : (params, t) => Repository.deleteItemCond(params, aprobacionDocumentos, t),
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, aprobacionDocumentos, t)
  };
};
