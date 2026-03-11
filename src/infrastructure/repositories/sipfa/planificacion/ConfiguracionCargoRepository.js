'use strict';

const Repository = require('../../Repository');
const { getQuery, toJSON } = require('../../../lib/util');

module.exports = function ConfiguracionCargoRepository (models, Sequelize) {
  const { ConfiguracionCargo } = models.planificacion;
  const Op = Sequelize.Op;

  async function findAll (params = {}) {
    const query = getQuery(params);
    query.attributes = [
      'id',
      'idCargo',
      'idDepenenciaLinea',
      'idDependenciaFuncional',
      'idDependenciaFormulario',
      'idDependenciaPoai',
      'idApruebaViaje',
      'idElaboraMemorandumViaje',
      'idUnidadOrganizacional'
    ];
    // query.include = [
    //   {
    //     required   : true,
    //     model      : plantilla,
    //     as         : 'plantilla',
    //     attributes : ['id', 'nombre', 'abreviacion', 'plantilla', 'plantillaValor']
    //   }
    // ]
    query.where = {};
    if (params.idDepenenciaLinea) {
      query.where.idDepenenciaLinea = params.idDepenenciaLinea;
    }

    const result = await ConfiguracionCargo.findAndCountAll(query);
    return toJSON(result);
  }

  async function findOne (params = {}) {
    const query = {};
    query.attributes = [
      'id',
      'idCargo',
      'idDepenenciaLinea',
      'idDependenciaFuncional',
      'idDependenciaFormulario',
      'idDependenciaPoai',
      'idApruebaViaje',
      'idElaboraMemorandumViaje',
      'idUnidadOrganizacional'
    ];
    // query.include = [
    //   {
    //     required   : false,
    //     model      : plantilla,
    //     as         : 'plantilla',
    //     attributes : ['id', 'nombre', 'abreviacion', 'plantilla', 'plantillaValor']
    //   }
    // ]
    query.where = params;
    if (params.id) {
      query.where.id = params.id;
    }
    const result = await ConfiguracionCargo.findOne(query);
    if (!result) return null;
    return result.toJSON();
  }
  return {
    findAll,
    findOne,
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, ConfiguracionCargo, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, ConfiguracionCargo, t)
  };
};
