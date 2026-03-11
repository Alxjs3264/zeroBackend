'use strict';

module.exports = function setupFlujoRoute (api, controllers, middlewares) {
  const { FlujoController } = controllers;
  const { AuthMiddleware } = middlewares;

  api.get('/historialFlujo', AuthMiddleware.verificarPermisos(['documento:listar']), FlujoController.historial);

  api.get('/categoriasFlujo', AuthMiddleware.verificarPermisos(['documento:listar']), FlujoController.categoriasFlujos);

  return api;
};
