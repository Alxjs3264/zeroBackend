'use strict';

module.exports = function setupParametro (api, controllers, middlewares) {
  const { ParametroController } = controllers;
  const { AuthMiddleware } = middlewares;

  api.get('/parametros', AuthMiddleware.verificarPermisos(['parametros:listar']), ParametroController.findAll);
  api.get('/parametros/:id', AuthMiddleware.verificarPermisos(['parametros:ver']), ParametroController.mostrar);
  api.post('/parametros', AuthMiddleware.verificarPermisos(['parametros:crear']), ParametroController.crear);
  api.put('/parametros/:id', AuthMiddleware.verificarPermisos(['parametros:actualizar']), ParametroController.actualizar);
  api.delete('/parametros/:id', AuthMiddleware.verificarPermisos(['parametros:eliminar']), ParametroController.eliminar);

  return api;
};
