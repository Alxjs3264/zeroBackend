'use strict';

module.exports = function setupSocio (api, controllers, middlewares) {
  const { ComponenteController } = controllers;
  const { AuthMiddleware } = middlewares;

  api.get('/componente', AuthMiddleware.verificarPermisos(['componente:listar']), ComponenteController.listar);
  api.get('/componente/:id', AuthMiddleware.verificarPermisos(['componente:listarpor']), ComponenteController.listarpor);
  api.post('/componente', AuthMiddleware.verificarPermisos(['componente:crear']), ComponenteController.crear);
  api.put('/componente/:id', AuthMiddleware.verificarPermisos(['componente:actualizar']), ComponenteController.actualizar);
  api.delete('/componente/:id', AuthMiddleware.verificarPermisos(['componente:eliminar']), ComponenteController.eliminar);

  api.post('/componente/interoperabilidad', ComponenteController.ejecutarInteroperabilidad);
  api.post('/componente/interoperabilidadPresupuesto', ComponenteController.ejecutarInteroperabilidadPresupuesto);

  return api;
};
