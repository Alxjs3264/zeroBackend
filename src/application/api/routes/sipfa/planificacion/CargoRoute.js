'use strict';

module.exports = function setupCargo (api, controllers, middlewares) {
  const { CargoController } = controllers;
  const { AuthMiddleware } = middlewares;

  api.get('/cargo', AuthMiddleware.verificarPermisos(['cargos:listar']), CargoController.findAll);
  api.get('/cargo/:id', AuthMiddleware.verificarPermisos(['cargos:ver']), CargoController.mostrar);
  api.post('/cargo', AuthMiddleware.verificarPermisos(['cargos:crear']), CargoController.crear);
  api.put('/cargo/:id', AuthMiddleware.verificarPermisos(['cargos:actualizar']), CargoController.actualizar);
  api.delete('/cargo/:id', AuthMiddleware.verificarPermisos(['cargos:eliminar']), CargoController.eliminar);

  api.get('/cargo/:id/dependientes', AuthMiddleware.verificarPermisos(['cargos:listar']), CargoController.dependientes);
  api.post('/cargo/importar', AuthMiddleware.verificarPermisos(['cargos:crear']), CargoController.importar);

  return api;
};
