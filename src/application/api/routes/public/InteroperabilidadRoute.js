'use strict';

module.exports = function setupAuth (api, controllers, middlewares) {
  const {
    AuthController,
    UsuarioController,
    SolicitudEjecucionController,
    FlujoDocumentalController,
    RolController,
    EntidadController,
    AreaController,
    CargoController,
    ReporteController
  } = controllers;

  const { PublicMiddleware } = middlewares;

  api.get('/codigo', AuthController.codigo);

  api.get('/autorizar', AuthController.autorizar);

  api.post('/logout', AuthController.logout);

  api.put('/refresh-token', AuthController.refreshToken);

  api.post('/verificar-usuario', UsuarioController.verificarUsuario);

  api.post('/crear', SolicitudEjecucionController.crearFlujo);

  api.post('/vincular-flujos', SolicitudEjecucionController.vincularFlujos);

  api.get('/flujo-documental/:hojaRuta/datos-consolidados', FlujoDocumentalController.datosConsolidadosFlujo);

  api.get('/flujo-documental/:hojaRuta/datos-consolidados', FlujoDocumentalController.datosConsolidadosFlujo);

  // RUTAS PARA ASIGNAR CARGOS
  api.get('/roles', RolController.listar);

  api.get('/entidades', EntidadController.listar);

  api.get('/areas', AreaController.findAll);

  api.get('/cargos', CargoController.findAll);

  // PublicMiddleware.verificarToken(), PublicMiddleware.verificarPermisos(['usuarios:creacion-usuario']),
  api.post('/crear-usuario',  UsuarioController.crearUsuario);

  // SEPDAVI
  api.get('/sitpreco/verificar-usuario', PublicMiddleware.verificarToken(), PublicMiddleware.verificarPermisos(['usuarios:consultar-datos']), UsuarioController.obtenerDatosUsuario);

  // SITPRECO
  api.get('/sepdavi/verificar-usuario', PublicMiddleware.verificarToken(), PublicMiddleware.verificarPermisos(['usuarios:consultar-datos']), UsuarioController.obtenerDatosUsuario);

  // REPORTES
  api.get('/flujo-documental/:id/historial',  PublicMiddleware.verificarToken(), PublicMiddleware.verificarPermisos(['historial:ver']), FlujoDocumentalController.historial);
  api.get('/reporte/reporte-solvencia', PublicMiddleware.verificarToken(), PublicMiddleware.verificarPermisos(['solvencias:listar']), ReporteController.reporteSolvencias);

  return api;
};
