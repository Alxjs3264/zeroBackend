'use strict';

module.exports = function setupParametro (api, controllers, middlewares) {
  const { CarpetaController } = controllers;
  const { AuthMiddleware } = middlewares;

  api.get('/carpeta', AuthMiddleware.verificarPermisos(['carpetas:listar']), CarpetaController.findAll);
  api.get('/carpeta/:id', AuthMiddleware.verificarPermisos(['carpetas:ver']), CarpetaController.mostrar);
  api.post('/carpeta', AuthMiddleware.verificarPermisos(['carpetas:crear']), CarpetaController.crear);
  api.put('/carpeta/:id', AuthMiddleware.verificarPermisos(['carpetas:actualizar']), CarpetaController.actualizar);
  api.delete('/carpeta/:id', AuthMiddleware.verificarPermisos(['carpetas:eliminar']), CarpetaController.eliminar);

  return api;
};
