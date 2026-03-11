'use strict';

const { query } = require('express');
const { getQuery, errorHandler, toJSON } = require('../../lib/util');
const Repository = require('../Repository');

module.exports = function usuariosServicioRepository (models, Sequelize) {
  const Op = Sequelize.Op;
  const { Carpeta } = models;

  async function findAll (params = {}) {
    const query = getQuery(params);

    query.attributes = [
      'id',
      'nombre',
      'descripcion',
      'usuariosCompartidos',
      'areasCompartidas',
      'userCreated',
      'tipo',
      'idAreaCreacion',
      [Sequelize.literal('(SELECT COUNT(*) FROM gestion_flujo_documental gfd WHERE gfd.id_carpeta = carpeta.id)'), 'cantidadHojasRuta']
    ];
    query.where = { [Op.and]: [] };

    if (params.userCreated || params.idArea || params.idUsuario) {
      query.where[Op.and] = [{ [Op.or]: [] }];
    }

    if (params.userCreated) {
      query.where[Op.and][0][Op.or].push({ userCreated: params.userCreated, tipo: 'PERSONAL' });
      // query.where[Op.and][0][Op.or].push({ usuariosCompartidos: { [Op.iLike]: params.userCreated } });
    }

    if (params.idArea) {
      query.where[Op.and][0][Op.or].push({ idAreaCreacion: params.idArea, tipo: 'AREA' });
      // query.where[Op.and][0][Op.or].push({ areasCompartidas: { [Op.iLike]: params.idArea } });
    }
    if (params.gestion) {
      query.where[Op.and].push({ gestion: params.gestion });
    }

    const result = await Carpeta.findAndCountAll(query);
    return toJSON(result);
  }

  return {
    findAll,
    findOne        : params => Repository.findOne(params, Carpeta),
    findById       : id => Repository.findById(id, Carpeta),
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, Carpeta, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, Carpeta, t),
    deleteItemCond : (params, t) => Repository.deleteItemCond(params, Carpeta, t)
  };
};
