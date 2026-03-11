'use strict';

module.exports = function setupArchivoAdjuntoRoute (api, controllers, middlewares) {
  const { ArchivoAdjuntoController } = controllers;
  const { AuthMiddleware } = middlewares;

  api.get('/archivo-adjunto', AuthMiddleware.verificarPermisos(['documento:listar']), ArchivoAdjuntoController.listar);
  api.post('/archivo-adjunto', AuthMiddleware.verificarPermisos(['documento:listar']), ArchivoAdjuntoController.crear);
  api.put('/archivo-adjunto/:id', AuthMiddleware.verificarPermisos(['documento:listar']), ArchivoAdjuntoController.actualizar);
  api.post('/archivo-adjunto/upload', AuthMiddleware.verificarPermisos(['documento:listar']), ArchivoAdjuntoController.upload);
  api.delete('/archivo-adjunto/:id', AuthMiddleware.verificarPermisos(['documento:listar']), ArchivoAdjuntoController.eliminar);
  api.get('/archivo-adjunto/:id/pdf', ArchivoAdjuntoController.verPdf);

  return api;
};
