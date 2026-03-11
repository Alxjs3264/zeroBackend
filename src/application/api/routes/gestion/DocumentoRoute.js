'use strict';

module.exports = function setupSocio (api, controllers, middlewares) {
  const { DocumentoController } = controllers;
  const { AuthMiddleware } = middlewares;

  api.get('/documentos', AuthMiddleware.verificarPermisos(['documento:listar']), DocumentoController.findAll);
  api.get('/documentoInternoSearch', AuthMiddleware.verificarPermisos(['documento:listar']), DocumentoController.listar);
  api.get('/documento/:id', AuthMiddleware.verificarPermisos(['documento:crear']), DocumentoController.findOne);
  api.delete('/documento/:id', AuthMiddleware.verificarPermisos(['documento:eliminar']), DocumentoController.eliminar);
  api.post('/documento', AuthMiddleware.verificarPermisos(['documento:crear']), DocumentoController.crear);

  api.put('/documento/:id', AuthMiddleware.verificarPermisos(['documento:crear']), DocumentoController.actualizar);

  api.post('/vistoBuenoCreacion', AuthMiddleware.verificarPermisos(['documento:actualizar']), DocumentoController.vistoBuenoCreacion);

  api.post('/vistoBuenoDerivacion', AuthMiddleware.verificarPermisos(['documento:actualizar']), DocumentoController.vistoBuenoDerivacion);

  api.get('/documento/:id/pdf', DocumentoController.generarPdf);
  
  api.get('/documento/:id/plantilla-word', DocumentoController.generarPlantillaWord);
  api.post('/documento/:id/plantilla-pdf', DocumentoController.establecerPlantillaPdf);

  api.get('/headerPdfDocumento/:id', DocumentoController.generarHeaderPdf);

  api.get('/generarDocumentos/:tipoDocumento/documento/:id', DocumentoController.generarPdfDocumento);

  api.get('/documento/:id/cantidad-extra', DocumentoController.cantidadExtra);

  api.get('/super-buscador', AuthMiddleware.verificarPermisos(['documento:listar']), DocumentoController.superBuscador);

  api.get('/super-buscador-documento', AuthMiddleware.verificarPermisos(['documento:listar']), DocumentoController.superBuscadorDocumentos);

  api.get('/super-buscador-tramite', AuthMiddleware.verificarPermisos(['documento:listar']), DocumentoController.superBuscadorTramites);

  api.patch('/documento/:id/cite', AuthMiddleware.verificarPermisos(['documento:generarCite']), DocumentoController.generarCite);

  api.patch('/documento/:id/fecha', AuthMiddleware.verificarPermisos(['documento:generarCite']), DocumentoController.actualizarFechaDocumento);

  api.post('/documento/:id/correccion-documento', AuthMiddleware.verificarPermisos(['documento:generarCite']), DocumentoController.correccionDocumento);

  api.put('/documento/:id/cambiar-documento', AuthMiddleware.verificarPermisos(['documento:actualizar']), DocumentoController.cambiarDocumento);

  api.put('/documento/:id/cancelar-documento', AuthMiddleware.verificarPermisos(['documento:actualizar']), DocumentoController.cancelarDocumento);

  api.post('/documento/:id/observacion-flujo-fisico', DocumentoController.observarFlujoFisico);

  api.put('/documento/:id/correccion-flujo-fisico', DocumentoController.correccionFlujoFisico);

  api.get('/documento/:id/observacion-flujo-fisico', DocumentoController.getObservacionFlujoFisico);

  api.get('/documento/:id/ver-firmas', DocumentoController.verFirmas);

  api.post('/documento/:id/palabra-clave', DocumentoController.agregarPalabrasClave);

  api.delete('/documento/:id/palabra-clave', DocumentoController.borrarPalabrasClave);

  api.get('/documento/:id/ver-adjuntos', DocumentoController.verAdjuntos);

  api.post('/documento/:id/registrar-descarga', DocumentoController.registroDescarga);

  api.post('/documento/:id/registrar-visualizacion', DocumentoController.registroVisualizacion);

  return api;
};
