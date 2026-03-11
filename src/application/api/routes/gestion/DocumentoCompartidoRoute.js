'use strict';

module.exports = function setupSocio (api, controllers, middlewares) {
  const { DocumentoCompartidoController } = controllers;
  const { AuthMiddleware } = middlewares;

  api.get('/documento-compartido', AuthMiddleware.verificarPermisos(['publicacion:listar']), DocumentoCompartidoController.findAll);
  api.get('/documento-compartido/:id', AuthMiddleware.verificarPermisos(['publicacion:listarpor']), DocumentoCompartidoController.findOne);
  api.post('/documento-compartido', AuthMiddleware.verificarPermisos(['publicacion:crear']), DocumentoCompartidoController.createItem);
  api.delete('/documento-compartido/:id', AuthMiddleware.verificarPermisos(['publicacion:eliminar']), DocumentoCompartidoController.deleteItem);

  api.put('/documento-compartido/:id', AuthMiddleware.verificarPermisos(['publicacion:actualizar']), DocumentoCompartidoController.updateItem);
  api.patch('/documento-compartido/:id/visto', AuthMiddleware.verificarPermisos(['publicacion:actualizar']), DocumentoCompartidoController.visto);
  api.patch('/documento-compartido/:id/aprobado', AuthMiddleware.verificarPermisos(['publicacion:actualizar']), DocumentoCompartidoController.aprobado);

  return api;
};
