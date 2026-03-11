'use strict';

module.exports = function setupParametro (api, controllers, middlewares) {
  const { TicketController } = controllers;
  const { AuthMiddleware } = middlewares;

  api.get('/ticket/parametros', TicketController.getParametros);
  api.post('/ticket/generar', TicketController.crearTicket);
  api.get('/ticket/url-auth-login', TicketController.obtenerUrlLogin);
//   api.put('/notificacion/srh/consentimiento/:id', NotificacionController.consentirNotificacion);

  return api;
};