'use strict';

module.exports = function setupSocio (api, controllers, middlewares) {
  const { ServicioController } = controllers;
  const { AuthMiddleware } = middlewares;

  api.get('/servicio', AuthMiddleware.verificarPermisos(['servicios:listar']), ServicioController.listar);
  api.get('/servicio/:id', AuthMiddleware.verificarPermisos(['servicios:ver']), ServicioController.findOne);
  api.post('/servicio', AuthMiddleware.verificarPermisos(['servicios:crear']), ServicioController.crear);
  api.put('/servicio/:id', AuthMiddleware.verificarPermisos(['servicios:actualizar']), ServicioController.actualizar);
  api.delete('/servicio/:id', AuthMiddleware.verificarPermisos(['servicios:eliminar']), ServicioController.eliminar);

  api.get('/servicio-basico', AuthMiddleware.verificarPermisos(['servicios:listar']), ServicioController.findAllBasico);
  api.get('/servicio-basico/:id', AuthMiddleware.verificarPermisos(['servicios:ver']), ServicioController.findOneBasico);

  return api;
};
