'use strict';

module.exports = function setupArchivoAdjuntoRoute (api, controllers, middlewares) {
  const { ReferenciaDocumentoController } = controllers;
  const { AuthMiddleware } = middlewares;

  api.get('/referencia-documento', AuthMiddleware.verificarPermisos(['documento:listar']), ReferenciaDocumentoController.listar);
  api.post('/referencia-documento', AuthMiddleware.verificarPermisos(['documento:listar']), ReferenciaDocumentoController.crear);
  api.delete('/referencia-documento/:id', AuthMiddleware.verificarPermisos(['documento:listar']), ReferenciaDocumentoController.eliminar);

  return api;
};
