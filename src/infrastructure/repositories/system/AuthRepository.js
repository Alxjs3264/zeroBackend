'use strict';

const Repository = require('../Repository');
const { saltRounds } = require('../../../common/config/auth');
const bcrypt = require('bcrypt');

module.exports = function authRepository (models, Sequelize) {
  const { auth } = models;
  const Op = Sequelize.Op;

  function codificarContrasena (password) {
    return bcrypt.hash(password, saltRounds);
  }

  function verificarContrasena (password, hash) {
    return bcrypt.compare(password, hash);
  }

  async function findOne (params = {}) {
    const query = {};
    query.attributes = [
      'id',
      'ip',
      'state',
      'estado',
      'parametros',
      'navegador',
      'userAgent',
      'tokens',
      'idEntidad',
      'idRol',
      'idUsuario',
      'userCreated',
      'userUpdated',
      'userDeleted',
      'tokenSistema',
      'authCiudadania'
    ];

    query.where = params;
    query.include = [];

    const result = await auth.findOne(query);
    if (!result) {
      return null;
    }
    return result.toJSON();
  }

  async function findForCD (idUsuario) {
    const query = {
      order: [
        ['createdAt', 'DESC']
      ],
      where: {
        idUsuario,
        tokens: {
          [Op.not]: null
        }
      }
    };

    query.include = [];

    const result = await auth.findOne(query);
    if (!result) {
      return null;
    }
    return result.toJSON();
  }

  return {
    findForCD,
    codificarContrasena,
    verificarContrasena,
    findOne,
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, auth, t),
    deleteItemCond : (params, t) => Repository.deleteItemCond(params, auth, t)
  };
};
