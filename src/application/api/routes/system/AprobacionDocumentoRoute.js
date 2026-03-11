'use strict';
module.exports = function setupSocio (api, controllers, middlewares) {
  const { AprobacionDocumentosController } = controllers;
  const { AuthMiddleware } = middlewares;

  api.get('/aprobacion-documento', AuthMiddleware.verificarToken(), AprobacionDocumentosController.listar);

  api.get('/aprobacion-documento/:idDocumento', AuthMiddleware.verificarToken(), AprobacionDocumentosController.findOne);

  api.post('/aprobacion-documento/:id', AuthMiddleware.verificarToken(), AprobacionDocumentosController.generarSolicitud);

  api.post('/aprobacion-documento/ciudadania/verificar-aprobacion', AuthMiddleware.verificarToken(), AprobacionDocumentosController.verificarAprobacion);

  return api;
};
