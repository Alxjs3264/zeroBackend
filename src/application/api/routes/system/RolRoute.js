'use strict';
module.exports = function setupSocio (api, controllers, middlewares) {
  const { RolController } = controllers;
  const { AuthMiddleware } = middlewares;

  api.get('/roles', AuthMiddleware.verificarPermisos(['roles:listar']), RolController.listar);
  api.get('/roles/:id', AuthMiddleware.verificarPermisos(['roles:ver']), RolController.recuperarPorId);
  api.post('/roles', AuthMiddleware.verificarPermisos(['roles:crear']), RolController.crear);
  api.put('/roles/:id', AuthMiddleware.verificarPermisos(['roles:actualizar']), RolController.actualizar);
  api.delete('/roles/:id', AuthMiddleware.verificarPermisos(['roles:eliminar']), RolController.eliminar);

  api.patch('/roles/:id/duplicar', AuthMiddleware.verificarPermisos(['roles:actualizar']), RolController.duplicar);
  api.get('/roles/:id/permisos', AuthMiddleware.verificarPermisos(['roles:crear', 'roles:actualizar']), RolController.listarPermisos);
  api.get('/roles/lista/permisos', AuthMiddleware.verificarPermisos(['permisos:listar']), RolController.listarPermisos);

  return api;
};
