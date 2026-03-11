'use strict';

module.exports = function setupSocio (api, controllers, middlewares) {
  const { FlujoDerivacionController } = controllers;
  const { AuthMiddleware, DerivacionMiddleware } = middlewares;

  api.get('/flujos-derivacion', AuthMiddleware.verificarPermisos(['documento:listar']), FlujoDerivacionController.listar);

  api.get('/flujos-derivacion-reasignacion', AuthMiddleware.verificarPermisos(['documento:listar']), FlujoDerivacionController.listarBandejaReasignacion);

  api.get('/flujos-derivacion/pendientes-firma', AuthMiddleware.verificarPermisos(['documento:listar']), FlujoDerivacionController.listarPendientesFirma);

  api.delete('/flujos-derivacion/:id', AuthMiddleware.verificarPermisos(['flujoDerivacion:eliminar']), FlujoDerivacionController.eliminar);

  api.patch('/flujos-derivacion/:id/estado', AuthMiddleware.verificarPermisos(['documento:listar']), FlujoDerivacionController.actualizarEstado);

  api.patch('/flujos-derivacion/:id/recepcionar', AuthMiddleware.verificarPermisos(['documento:listar']), FlujoDerivacionController.recepcionar);

  api.get('/flujos-derivacion/cantidades', AuthMiddleware.verificarPermisos(['documento:listar']), FlujoDerivacionController.cantidades);

  api.put('/flujos-derivacion/derivar/:id', AuthMiddleware.verificarPermisos(['documento:listar']), FlujoDerivacionController.derivar);

  api.put('/flujos-derivacion/devolver-bandeja-pendientes/:idFlujo', AuthMiddleware.verificarPermisos(['documento:listar']), FlujoDerivacionController.devolverAPendientes);

  api.put('/flujos-derivacion/derivar/:id/final', AuthMiddleware.verificarPermisos(['documento:listar']), FlujoDerivacionController.derivacionFinal);

  api.get('/flujos-derivacion/aprobacion/:id', FlujoDerivacionController.aprobacionCiudadania);

  api.get('/flujos-derivacion/regenerar-aprobacion/:id', FlujoDerivacionController.generarArobacionCiudadaniaUsuario);

  api.get('/flujos-derivacion/:id/datos-completos', AuthMiddleware.verificarPermisos(['documento:listar']), FlujoDerivacionController.datosDerivacion);

  // RUTAS DE DERIVACION

  api.patch('/flujos-derivacion/:id/derivacion-normal', AuthMiddleware.verificarPermisos(['documento:listar']), DerivacionMiddleware.validarDerivacion(), FlujoDerivacionController.derivacionNormal);

  api.patch('/flujos-derivacion/:id/derivacion-proveido', AuthMiddleware.verificarPermisos(['documento:listar']), DerivacionMiddleware.validarDerivacion(), FlujoDerivacionController.derivacionProveido);

  api.patch('/flujos-derivacion/:id/derivacion-crear-documento', AuthMiddleware.verificarPermisos(['documento:listar']), DerivacionMiddleware.validarDerivacion(), FlujoDerivacionController.derivacionCrearDocumento);

  api.patch('/flujos-derivacion/:id/derivacion-archivar', AuthMiddleware.verificarPermisos(['documento:listar']), DerivacionMiddleware.validarDerivacion(), FlujoDerivacionController.derivacionArchivar);

  api.patch('/flujos-derivacion/:id/derivacion-cerrar', AuthMiddleware.verificarPermisos(['documento:listar']), DerivacionMiddleware.validarDerivacion(), FlujoDerivacionController.derivacionCerrar);

  api.patch('/flujos-derivacion/:id/derivacion-derivar-documento', AuthMiddleware.verificarPermisos(['documento:listar']), DerivacionMiddleware.validarDerivacion(), FlujoDerivacionController.derivacionDerivarDocumento);

  api.patch('/flujos-derivacion/:id/observacion-normal', AuthMiddleware.verificarPermisos(['documento:listar']), DerivacionMiddleware.validarDerivacion(), FlujoDerivacionController.observacionNormal);

  api.patch('/flujos-derivacion/:id/derivacion-proveido-observacion', AuthMiddleware.verificarPermisos(['documento:listar']), DerivacionMiddleware.validarDerivacion(), FlujoDerivacionController.derivacionProveidoObservacion);

  api.patch('/flujos-derivacion/:id/observacion-paso', AuthMiddleware.verificarPermisos(['documento:listar']), DerivacionMiddleware.validarDerivacion(), FlujoDerivacionController.observacionPaso);

  api.patch('/flujos-derivacion/:idFlujo/observacion-desvinculacion', AuthMiddleware.verificarPermisos(['documento:listar']), FlujoDerivacionController.observacionDesvinculacion);

  api.put('/flujos-derivacion/reasignacion', FlujoDerivacionController.reasignacion);

  api.put('/flujos-derivacion/:id/modificar', AuthMiddleware.verificarPermisos(['flujoDerivacion:actualizar']), FlujoDerivacionController.modificarDerivacion);
  
  api.get('/flujos-derivacion/verificar/limite-pendientes', AuthMiddleware.verificarPermisos(['documento:listar']), FlujoDerivacionController.limitePendientes);

  return api;
};
