'use strict';

module.exports = function setupSocio (api, controllers, middlewares) {
  const { FlujoDocumentalController } = controllers;
  const { AuthMiddleware } = middlewares;

  api.get('/flujo-documental', AuthMiddleware.verificarPermisos(['flujoDocumental:listar']), FlujoDocumentalController.listar);

  api.get('/flujo-documental/libro', AuthMiddleware.verificarPermisos(['flujoDocumental:listar']), FlujoDocumentalController.libro);

  api.post('/flujo-documental/libro', AuthMiddleware.verificarPermisos(['flujoDocumental:listar']), FlujoDocumentalController.printBook);

  api.get('/flujo-documental/:id', AuthMiddleware.verificarPermisos(['flujoDocumental:listar']), FlujoDocumentalController.findOne);

  api.get('/flujo-documental/:id/documentos-generados', AuthMiddleware.verificarPermisos(['flujoDocumental:listar']), FlujoDocumentalController.listarDocumentos);

  api.patch('/flujo-documental/:id/vincular', AuthMiddleware.verificarPermisos(['flujoDocumental:listar']), FlujoDocumentalController.vincular);

  api.patch('/flujo-documental/:id/desarchivar', AuthMiddleware.verificarPermisos(['flujoDocumental:listar']), FlujoDocumentalController.desarchivar);

  api.patch('/flujo-documental/:id/recuperar', AuthMiddleware.verificarPermisos(['flujoDocumental:listar']), FlujoDocumentalController.recuperarDerivacion);

  api.get('/flujo-documental/:id/historial', AuthMiddleware.verificarPermisos(['flujoDocumental:listar']), FlujoDocumentalController.historial);

  api.get('/flujo-documental/:id/historial/pdf', AuthMiddleware.verificarPermisos(['flujoDocumental:listar']), FlujoDocumentalController.historialPdf);

  api.get('/flujo-documental/:id/plantilla-pdf', FlujoDocumentalController.plantillaPDF);

  return api;
};
