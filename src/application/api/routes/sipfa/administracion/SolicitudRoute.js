'use strict';

module.exports = function setupSolicitud (api, controllers, middlewares) {
  const { SolicitudController } = controllers;

  api.get('/solicitud', SolicitudController.findAll);
  api.get('/solicitudCargo', SolicitudController.listarPorCargo);
  api.get('/solicitudesPorPasoCargo', SolicitudController.listarPorPasoCargo);
  api.get('/solicitud/:id', SolicitudController.mostrar);
  api.post('/solicitudDerivacion/:id', SolicitudController.derivar);
  api.put('/solicitud/:id', SolicitudController.actualizar);
  api.delete('/solicitud/:id', SolicitudController.eliminar);
  api.get('/solicitud/:id/pdf', SolicitudController.generarPdf);
  api.get('/solicitudPoa/:id/pdf', SolicitudController.generarPoaPdf);
  api.get('/solicitudPresupuestaria/:id/pdf', SolicitudController.generarPresupuestariaPdf);
  api.get('/solicitudDinamico/:id/pdf', SolicitudController.generarPdfDinamico);
  return api;
};
