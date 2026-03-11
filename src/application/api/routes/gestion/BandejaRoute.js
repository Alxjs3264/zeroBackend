'use strict';

module.exports = function setupBandejaRoute (api, controllers, middlewares) {
  const { BandejaController } = controllers;
  const { AuthMiddleware } = middlewares;

  // TODO: corregir permisos
  
  api.get('/bandejaDocumentos', AuthMiddleware.verificarPermisos(['bandeja:listar']), BandejaController.bandeja);

  return api;
};
