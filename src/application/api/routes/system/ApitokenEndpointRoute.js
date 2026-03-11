'use strict';
module.exports = function setupSocio (api, controllers, middlewares) {
  const { ApitokenEndpointController } = controllers;
  const { AuthMiddleware } = middlewares;

  api.get('/iopToken', AuthMiddleware.verificarPermisos(['apitoken:modificar']), ApitokenEndpointController.listar);

  api.post('/iopToken', AuthMiddleware.verificarPermisos(['apitoken:modificar']), ApitokenEndpointController.crear);

  return api;
};
