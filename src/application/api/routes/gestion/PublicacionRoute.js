'use strict';

module.exports = function setupSocio (api, controllers, middlewares) {
  const { PublicacionController } = controllers;
  const { AuthMiddleware } = middlewares;

  api.get('/publicacion', AuthMiddleware.verificarPermisos(['publicacion:listar']), PublicacionController.findAll);
  api.get('/publicacion/:id', AuthMiddleware.verificarPermisos(['publicacion:ver']), PublicacionController.findOne);
  api.post('/publicacion', AuthMiddleware.verificarPermisos(['publicacion:crear']), PublicacionController.createItem);
  api.put('/publicacion/:id', AuthMiddleware.verificarPermisos(['publicacion:actualizar']), PublicacionController.updateItem);
  api.delete('/publicacion/:id', AuthMiddleware.verificarPermisos(['publicacion:eliminar']), PublicacionController.deleteItem);

  return api;
};
