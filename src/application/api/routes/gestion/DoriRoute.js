'use strict';

module.exports = function setupBandejaRoute (api, controllers, middlewares) {
  const { DoriController } = controllers;
  const { AuthMiddleware } = middlewares;

  api.get('/dori', DoriController.consultarCodigo);
  api.get('/search-dori',  DoriController.superBuscadorDori);
  return api;
};
