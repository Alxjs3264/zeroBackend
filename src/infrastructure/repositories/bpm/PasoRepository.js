'use strict';

const { getQuery, toJSON } = require('../../lib/util');
const Repository = require('../Repository');
const debug = require('debug')('app:Repository:Paso');

module.exports = function SolicitudPlantillaRepository (models, Sequelize) {
  const { Paso, PasoSiguiente, PasoAnterior, PasoObservacion, formulario } = models;
  const Op = Sequelize.Op;

  async function findAll (params = {}) {
    const query = getQuery(params);

    query.attributes = [
      'id',
      'configuracion',
      'configuracionCargo',
      'dependenciaFuncional',
      'idFormulario',
      'idSolicitudPlantilla',
      'idTipoCargo',
      'nombrePaso',
      'multiplesFormularios',
      'listaFormularios',
      'campo',
      'proveidoDefecto',
      'tipo',
      'idEntidad',
      'mostrarEntidad',
      'recuperarDocumento',
      'tipoFinalizacion'
    ];
    query.where = {};

    query.include = [
      {
        attributes: [
          'id',
          'nombre',
          'sigla',
          'configuracion_json'
        ],
        model : formulario,
        as    : 'formulario'
      }
    ];

    if (params.id) {
      query.where.id = params.id;
      if (Array.isArray(params.id)) query.where.id = { [Op.in]: params.id };
    }

    if (params.nombreFormulario) {
      query.include[0].required = true;
      query.include[0].where = { nombrePaso: { [Op.iLike]: `%${params.nombrePaso}%` } };
    }

    if (params.nombrePaso) query.where.nombrePaso = { [Op.iLike]: `%${params.nombrePaso}%` };
    if (params.idSolicitudPlantilla) query.where.idSolicitudPlantilla = params.idSolicitudPlantilla;

    const result = await Paso.findAndCountAll(query);
    return toJSON(result);
  }

  async function findOne (params = {}) {
    const query = {};
    query.where = params;
    query.include = [
      {
        model   : PasoSiguiente,
        as      : 'pasosSiguientes',
        include : [
          {
            attributes: [
              'id',
              'idSolicitudPlantilla',
              'tipo',
              'idEntidad',
              'mostrarEntidad',
              'recuperarDocumento',
              'nombrePaso',
              'idFormulario',
              'multiplesFormularios',
              'listaFormularios',
              'campo',
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
        model : PasoAnterior,
        as    : 'pasosAnteriores'
      },
      {
        model : PasoObservacion,
        as    : 'pasosObservacion'
      }
    ];
    const result = await Paso.findOne(query);

    if (result) {
      return result.toJSON();
    }

    return null;
  }

  return {
    findAll,
    findOne,
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, Paso, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, Paso, t)
  };
};
