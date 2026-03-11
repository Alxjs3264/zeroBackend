'use strict';

const Repository = require('../Repository');
const { getQuery, toJSON } = require('../../lib/util');
const { log } = require('log4js').getLogger();

module.exports = function derivacionRepository (models, Sequelize) {
  const { derivacion, derivacionVia, documento, flujoDocumental } = models;
  const Op = Sequelize.Op;

  function findAll (params = {}) {
    const query = getQuery(params);
    query.attributes = [
      'id',
      'idFlujo',
      'codigoFlujo',
      'usuarioInicial',
      'usuarioFinal',
      'accion',
      'descripcion',
      'estado'
    ];

    query.include = [
      {
        model    : flujoDocumental,
        attributes: [
          'id',
          'tipoFlujo',
          'etapaFlujo',
          'nroCopia',
          'idFlujoPadre',
          'estado'
        ],
        as       : 'flujoDocumental'
      },
    ];
    
    query.where = {};

    if (params.idFlujo) {
      query.where.idFlujo = params.idFlujo;
    }
         
    if (params.codigoFlujo) {
      query.where.codigoFlujo = params.codigoFlujo;
    }
         
    if (params.usuarioInicial) {
      query.where.usuarioInicial = params.usuarioInicial;
    }

    if (params.usuarioFinal) {
      query.where.usuarioFinal = params.usuarioFinal;
    }

    if (params.accion) {
      query.where.accion = params.accion;
    }

    if (params.descripcion) {
      query.where.descripcion = params.descripcion;
    }

    if (params.estado) {
      query.where.estado = params.estado;
    }

    
    query.include = [];

    return derivacion.findAndCountAll(query);
  }

  function findOne (params = {}) {
    const query = getQuery(params);
    query.attributes = [
      'id',
      'idFlujo',
      'idDocumento',
      'codigoFlujo',
      'usuarioInicial',
      'usuarioFinal',
      'accion',
      'descripcion',
      'estado'
    ];

    query.include = [
      {
        model    : flujoDocumental,
        attributes: [
          'id',
          'tipoFlujo',
          'etapaFlujo',
          'nroCopia',
          'idFlujoPadre',
          'estado'
        ],
        as       : 'flujoDocumental'
      },
    ];

    query.where = params;
    return derivacion.findOne(query);
  }

  async function derivacionesViaIncompletas (idDocumento, idUsuario) {
    try {
      const registro = await derivacion.findOne({
        where: { idDocumento },
        attributes: ['id', 'idDocumento']
      });
      if (!registro) return { count:0, rows: []};

      const derivacionesVia = await derivacionVia.findAndCountAll({
        where: {
          idDerivacion: registro.id,
          idUsuario,
          tipo: 'VISTO BUENO REQUERIDO',
          vistoBueno: false
        },
        attributes: ['id', 'idDerivacion', 'idUsuario', 'tipo', 'comentario', 'vistoBueno'],
      });
      return derivacionesVia;
    } catch (err) {
      log.error(`Error buscando derivaciones via`);
      log.error(err);
      throw new Error(`Error buscando derivaciones via para documento: ${idDocumento}`);
    }
  }
  
  /**
   * Busca documentos que tengan derivaciones que tengan via y sea de tipo 'VISTO BUENO REQUERIDO' y 
   * no tengan el visto bueno de todos los usuarios marcados como via
   */
  async function tieneDerivacionesViaIncompletas (idDocumento) {
    const query = {};
    query.where = { idDocumento, completada: false };
    query.attributes = ['id', 'idDocumento'];

    try {
      const registro = await derivacion.findOne(query);
      if (!registro) return false;
      const derivacionesVia = await derivacionVia.findAndCountAll({
        where: {
          idDerivacion: registro.id,
          tipo: 'VISTO BUENO REQUERIDO',
          vistoBueno: false
        },
        attributes: ['id'],
      });
      return derivacionesVia.count !== 0;
    } catch (err) {
      log.error(`Error buscando derivaciones via para documento: ${idDocumento}`);
      log.error(err);
      throw new Error(`Error buscando derivaciones via para documento: ${idDocumento}`);
    }
  }

  return {
    findAll,
    findOne,  
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, derivacion, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, derivacion, t),
    tieneDerivacionesViaIncompletas,
    derivacionesViaIncompletas
  };
};
