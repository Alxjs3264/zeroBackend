'use strict';

const { endpointsIop } = require('../../../common/config/constants');
const { getQuery, toJSON } = require('../../lib/util');
const log = require('log4js').getLogger();
const uuid = require('uuid');
const Repository = require('../Repository');

module.exports = function ApitokenEndpointRepository (models, Sequelize) {
  const { apitokenEndpoint, usuario } = models;
  const Op = Sequelize.Op;

  async function findAll (params = {}) {
    const query = {};
    query.where = {};

    query.attributes = [
      'id',
      'idUsuario',
      'nombreEntidad',
      'token',
      'endpoints',
      'activo'
    ];

    
    const where = {};

    if (params.nombreEntidad) {
      where.nombreEntidad = params.nombreEntidad;
    }

    if (params.activo) {
      where.activo = params.activo;
    }

    if (params.token) {
      where.token = params.token;
    }

    const result = await apitokenEndpoint.findAndCountAll(query);
    return toJSON(result);
  }

  async function findOne (params) {
    const query = {};
    query.where = params;
    query.attributes =  [
      'id',
      'idUsuario',
      'nombreEntidad',
      'token',
      'endpoints',
      'activo',
      'createdAt',
      'updatedAt'
    ];
    query.include = [
      {
        model      :  usuario,
        as         : 'usuario',
        attributes : [
          'usuario',
          'numeroDocumento',
          'celular',
          'correoElectronico'
        ]
      }
    ];

    const result =  apitokenEndpoint.findOne(query);
    return result;
  }

  /**
   * Ayuda a verificar si el token tiene permisos para el endpoint dado
   * Si el token esta autorizado, retorna el registro sino retorna null
   * 
   */
  async function verificarPermisos (token, endpoint) {
    try {
      const record = await findOne({ token, activo: true });
      if (record && record.endpoints.indexOf(endpoint) !== -1)
        return record;
      return null;
    } catch (err) {
      log.error('Error verificando permisos para token api');
      log.error(err);
      return null;
    }
  }

  async function createOrUpdate(data, t) {
    if (!Array.isArray(data.endpoints))
      throw new Error(`endpoints debe ser un array`);
    if (!data.endpoints.every(endpoint => typeof(endpoint) === 'string')) {
      throw new Error(`endpoints debe ser de cadenas`);
    }
    if (!data.endpoints.every(endpoint => endpointsIop.indexOf(endpoint) !== -1)) {
      throw new Error(`Algunos endpoints introducidos no son permitidos`);
    }
    
    data.token = uuid.v1() + '_' + parseInt(Math.random()*100) + '_' + uuid.v4();
    try {
      const _usuario = await usuario.findOne({
        where: { numeroDocumento: data.usuario },
        attributes: ['id']
      });
      if (!_usuario)
        throw new Error(`No se ha encontado usuario con C.I.: ${data.usuario}`);
      data.idUsuario = _usuario.id;
    } catch (err) {
      log.error(err);
      throw new Error(err);
    }
    return Repository.createOrUpdate(data, apitokenEndpoint, t);
  }

  return {
    verificarPermisos,
    findAll,
    findOne,
    createOrUpdate
  };
};
