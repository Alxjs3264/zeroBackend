'use strict';
module.exports = function setupSocio (api, controllers, middlewares) {
  const { ReporteController } = controllers;
  const { AuthMiddleware } = middlewares;

  api.get('/reporte/reporte-general', AuthMiddleware.verificarPermisos(['reporte:listar']), ReporteController.reporteGeneral);

  return api;
};
