'use strict';

const { getQuery, toJSON } = require('../../lib/util');
const Repository = require('../Repository');
const debug = require('debug')('app:Repository:SolicitudPlantilla');

module.exports = function SolicitudPlantillaRepository (models, Sequelize) {
  const { SolicitudPlantilla, Paso, PasoSiguiente, PasoAnterior, PasoObservacion, entidad, area } = models;
  const Op = Sequelize.Op;

  async function findAll (params = {}) {
    debug(params);
    const query = getQuery(params);

    query.where = {};

    query.include = [
      {
        attributes : [],
        through    : { attributes: [] },
        model      : entidad,
        as         : 'entidadesSolicitud'
      },
      {
        attributes : [],
        through    : { attributes: [] },
        model      : area,
        as         : 'areasSolicitud'
      }
    ];

    if (params.estado) query.where.estado = params.estado;
    if (params.nombre) query.where.nombre = { [Op.iLike]: `%${params.nombre}%` };
    if (params.search) query.where.nombre = { [Op.iLike]: `%${params.search}%` };
    if (params.idSolicitudPlantilla) query.where.idSolicitudPlantilla = params.idSolicitudPlantilla;

    if (params.descripcion) query.where.descripcion = { [Op.iLike]: `%${params.descripcion}%` };

    if (params.codigo) query.where.codigo = { [Op.iLike]: `%${params.codigo}%` };

    if (params.filtrosEntidad) {
      query.where[Op.or] = [
        { '$entidadesSolicitud.id$': Array.isArray(params.idEntidad) ? { [Op.in]: params.idEntidad } : params.idEntidad },
        { '$areasSolicitud.id$': Array.isArray(params.idAreas) ? { [Op.in]: params.idAreas } : params.idAreas }
      ];
    }

    const result = await SolicitudPlantilla.findAndCountAll(query);
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
          'idFormulario',
          'idTipoCargo',
          'proveidoDefecto',
          'tipoFinalizacion',
          'dependenciaFuncional',
          'configuracionCargo',
          'configuracion'
        ],
        model   : Paso,
        as      : 'pasos',
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

    const result = await SolicitudPlantilla.findOne(query);

    if (result) {
      return result.toJSON();
    }

    return null;
  }

  return {
    findAll,
    findOne,
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, SolicitudPlantilla, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, SolicitudPlantilla, t)
  };
};
