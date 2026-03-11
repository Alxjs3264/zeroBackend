'use strict';

module.exports = function setupSocio (api, controllers, middlewares) {
  const { SolicitudPlantillaController } = controllers;
  const { AuthMiddleware } = middlewares;

  api.get('/solicitud-plantilla', AuthMiddleware.verificarPermisos(['solicitud-plantilla:listar']), SolicitudPlantillaController.findAll);
  api.get('/solicitud-plantilla/:id', AuthMiddleware.verificarPermisos(['solicitud-plantilla:ver']), SolicitudPlantillaController.findOne);
  api.post('/solicitud-plantilla', AuthMiddleware.verificarPermisos(['solicitud-plantilla:crear']), SolicitudPlantillaController.createItem);
  api.put('/solicitud-plantilla/:id', AuthMiddleware.verificarPermisos(['solicitud-plantilla:actualizar']), SolicitudPlantillaController.updateItem);
  api.delete('/solicitud-plantilla/:id', AuthMiddleware.verificarPermisos(['solicitud-plantilla:eliminar']), SolicitudPlantillaController.deleteItem);

  api.get('/solicitud-plantilla/listar/permisos-entidad', AuthMiddleware.verificarPermisos(['solicitud-plantilla:listar']), SolicitudPlantillaController.listarPermisosEntidad);
  api.get('/solicitud-plantilla/listar/permisos-area', AuthMiddleware.verificarPermisos(['solicitud-plantilla:listar']), SolicitudPlantillaController.listarPermisosArea);

  // TODO: REVISAR SI EL PERMISO CORRESPONDE
  api.get('/solicitud-plantilla/:id/pasos-iniciales', AuthMiddleware.verificarPermisos(['solicitud-plantilla:ver']), SolicitudPlantillaController.findPasosIniciales);
  api.post('/solicitud-plantilla/:id/clonar', AuthMiddleware.verificarPermisos(['solicitud-plantilla:crear']), SolicitudPlantillaController.clonarsolicitudPlantilla);

  return api;
};
