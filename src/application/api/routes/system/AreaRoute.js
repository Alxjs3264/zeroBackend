'use strict';

module.exports = function setupParametro (api, controllers, middlewares) {
  const { AreaController } = controllers;
  const { AuthMiddleware } = middlewares;

  api.get('/areas', AuthMiddleware.verificarPermisos(['areas:listar']), AreaController.findAll);
  api.get('/areas/:id', AuthMiddleware.verificarPermisos(['areas:ver']), AreaController.mostrar);
  api.post('/areas', AuthMiddleware.verificarPermisos(['areas:crear']), AreaController.crear);
  api.put('/areas/:id', AuthMiddleware.verificarPermisos(['areas:actualizar']), AreaController.actualizar);
  api.delete('/areas/:id', AuthMiddleware.verificarPermisos(['areas:eliminar']), AreaController.eliminar);

  api.post('/areas/importar', AuthMiddleware.verificarPermisos(['areas:crear']), AreaController.importar);

  return api;
};
