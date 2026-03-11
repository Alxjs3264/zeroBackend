'use strict';

module.exports = function setupParametro (api, controllers, middlewares) {
  const { NotificacionController } = controllers;
  const { AuthMiddleware } = middlewares;

  api.get('/notificacion/srh/marcados', NotificacionController.findMarcadosSrh);
  api.put('/notificacion/srh/consentimiento/:id', NotificacionController.consentirNotificacion);

  return api;
};
