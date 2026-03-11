'use strict';

module.exports = function setupSocio (api, controllers, middlewares) {
  const { FormularioController } = controllers;
  const { AuthMiddleware } = middlewares;

  api.get('/formulario', AuthMiddleware.verificarPermisos(['formularios:listar']), FormularioController.listar);
  api.get('/formulario/:id', AuthMiddleware.verificarPermisos(['formularios:ver']), FormularioController.listarpor);
  api.post('/formulario', AuthMiddleware.verificarPermisos(['formularios:crear']), FormularioController.crear);
  api.put('/formulario/:id', AuthMiddleware.verificarPermisos(['formularios:actualizar']), FormularioController.actualizar);
  api.delete('/formulario/:id', AuthMiddleware.verificarPermisos(['formularios:eliminar']), FormularioController.eliminar);

  api.get('/formularioListar', AuthMiddleware.verificarPermisos(['formularios:listar']), FormularioController.listarFormulario);
  api.get('/formulario/lista/campos', AuthMiddleware.verificarPermisos(['formularios:ver']), FormularioController.listarCampos);

  api.get('/formulario/listar/permisos-entidad', AuthMiddleware.verificarPermisos(['formulario:listar']), FormularioController.listarPermisosEntidad);
  api.get('/formulario/listar/permisos-area', AuthMiddleware.verificarPermisos(['formulario:listar']), FormularioController.listarPermisosArea);

  return api;
};
