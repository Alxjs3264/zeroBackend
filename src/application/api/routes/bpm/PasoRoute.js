'use strict';

module.exports = function setupSocio (api, controllers, middlewares) {
  const { PasoController } = controllers;
  const { AuthMiddleware } = middlewares;

  api.get('/paso', AuthMiddleware.verificarPermisos(['componente:listar']), PasoController.findAll);

  api.post('/paso/:id/ejecucion-interoperabilidad', AuthMiddleware.verificarPermisos(['componente:listar']), PasoController.ejecucionInteroperabilidad);

  return api;
};
