'use strict';

const { getQuery, toJSON } = require('../../lib/util');
const Repository = require('../Repository');
const debug = require('debug')('app:Repository:Paso');

module.exports = function PasoActualRepository (models) {
  const { PasoActual, Paso, PasoSiguiente, PasoAnterior, PasoObservacion } = models;

  async function findAll (params = {}) {
    debug(params);
    const query = getQuery(params);

    query.where = {};

    query.include = [];

    const result = await PasoActual.findAndCountAll(query);
    return toJSON(result);
  }

  async function findOne (params = {}) {
    const query = {};
    query.where = params;

    query.include = [
      {
        attributes: [
          'id',
          'idSolicitudPlantilla',
          'tipo',
          'nombrePaso',
          'idEntidad',
          'mostrarEntidad',
          'idFormulario',
          'idTipoCargo',
          'proveidoDefecto',
          'tipoFinalizacion',
          'dependenciaFuncional',
          'configuracionCargo',
          'configuracion'
        ],
        model   : Paso,
        as      : 'pasoActual',
        include : [
          {
            attributes : ['id', 'idPasoSiguiente'],
            model      : PasoSiguiente,
            as         : 'pasosSiguientes',
            include    : [
              {
                attributes: [
                  'id',
                  'idSolicitudPlantilla',
                  'tipo',
                  'nombrePaso',
                  'idEntidad',
                  'mostrarEntidad',
                  'idFormulario',
                  'idTipoCargo',
                  'proveidoDefecto',
                  'tipoFinalizacion',
                  'dependenciaFuncional',
                  'configuracionCargo',
                  'configuracion'
                ],
                model : Paso,
                as    : 'pasoSiguiente'
              }
            ]
          },
          {
            attributes : ['id', 'idPasoAnterior'],
            model      : PasoAnterior,
            as         : 'pasosAnteriores',
            include    : [
              {
                attributes: [
                  'id',
                  'idSolicitudPlantilla',
                  'tipo',
                  'nombrePaso',
                  'idEntidad',
                  'mostrarEntidad',
                  'idFormulario',
                  'idTipoCargo',
                  'proveidoDefecto',
                  'tipoFinalizacion',
                  'dependenciaFuncional',
                  'configuracionCargo',
                  'configuracion'
                ],
                model : Paso,
                as    : 'pasoAnterior'
              }
            ]
          },
          {
            attributes : ['id', 'idPasoObservacion'],
            model      : PasoObservacion,
            as         : 'pasosObservacion',
            include    : [
              {
                attributes: [
                  'id',
                  'idSolicitudPlantilla',
                  'tipo',
                  'nombrePaso',
                  'idEntidad',
                  'mostrarEntidad',
                  'idFormulario',
                  'idTipoCargo',
                  'proveidoDefecto',
                  'tipoFinalizacion',
                  'dependenciaFuncional',
                  'configuracionCargo',
                  'configuracion'
                ],
                model : Paso,
                as    : 'pasoObservacion'
              }
            ]
          }
        ]
      }
    ];

    const result = await PasoActual.findOne(query);

    if (result) {
      return result.toJSON();
    }

    return null;
  }

  return {
    findAll,
    findOne,
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, PasoActual, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, PasoActual, t),
    deleteItemCond : (params, t) => Repository.deleteItemCond(params, PasoActual, t)
  };
};
