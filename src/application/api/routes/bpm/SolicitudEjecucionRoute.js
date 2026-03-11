'use strict';

module.exports = function setupSocio (api, controllers) {
  const { SolicitudEjecucionController } = controllers;
  // const { AuthMiddleware } = middlewares;

  api.get('/solicitud-ejecucion', SolicitudEjecucionController.findAll);
  api.get('/solicitud-ejecucion/:id', SolicitudEjecucionController.findOne);

  api.get('/solicitud-ejecucion/:id/paso-actual', SolicitudEjecucionController.findPasoActual);

  api.post('/solicitud-ejecucion', SolicitudEjecucionController.createItem);
  api.put('/solicitud-ejecucion/:id', SolicitudEjecucionController.updateItem);
  api.delete('/solicitud-ejecucion/:id', SolicitudEjecucionController.deleteItem);

  api.get('/solicitud-ejecucion/:id/pasos-siguientes', SolicitudEjecucionController.pasosSiguientes);
  api.get('/solicitud-ejecucion/:id/pasos-cancelacion', SolicitudEjecucionController.pasosCancelables);
  api.get('/solicitud-ejecucion/:id/pasos-observaciones', SolicitudEjecucionController.pasosObservaciones);

  api.delete('/solicitud-ejecucion/:id/cancelar', SolicitudEjecucionController.cancelarFlujo);

  //
  api.delete('/solicitud-ejecucion/:id/cancelar-flujo', SolicitudEjecucionController.cancelarFlujoNuevo);

  api.post('/solicitud-ejecucion/:id/ejecucion-interoperabilidad', SolicitudEjecucionController.ejecutarInteroperabilidad);

  api.get('/solicitud-ejecucion/:id/documentos-adjuntos', SolicitudEjecucionController.documentosAdjuntos);

  api.post('/solicitud-ejecucion/crear-flujo', SolicitudEjecucionController.crearFlujo);
  api.post('/solicitud-ejecucion/vincular-flujos', SolicitudEjecucionController.vincularFlujos);

  return api;
};
