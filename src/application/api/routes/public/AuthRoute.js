'use strict';
const { config } = require('../../../../common');

module.exports = function setupAuth (api, controllers, middlewares) {
  const { AuthController } = controllers;
  const { AuthMiddleware } = middlewares;

  api.get('/codigo', AuthController.codigo);

  api.get('/autorizar', AuthController.autorizar);

  api.post('/logout', AuthController.logout);

  api.put('/refresh-token', AuthMiddleware.verificarToken(), AuthController.refreshToken);

  return api;
};
