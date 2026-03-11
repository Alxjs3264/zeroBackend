'use strict';

module.exports = function setupUsuario (api, controllers, middlewares) {
  const { UsuarioController } = controllers;
  const { AuthMiddleware } = middlewares;

  api.get('/usuarios', AuthMiddleware.verificarPermisos(['usuarios:listar']), UsuarioController.listar);
  api.get('/remitentes', AuthMiddleware.verificarPermisos(['usuarios:listar']), UsuarioController.listarRemitentes);
  api.get('/usuarios/:id', AuthMiddleware.verificarPermisos(['usuarios:ver']), UsuarioController.mostrar);
  api.get('/usuario-editar/:id', AuthMiddleware.verificarPermisos(['usuarios:ver']), UsuarioController.findOne);
  api.post('/usuarios', AuthMiddleware.verificarPermisos(['usuarios:crear']), UsuarioController.crear);
  api.put('/usuarios/:id', AuthMiddleware.verificarPermisos(['usuarios:actualizar']), UsuarioController.actualizar);
  api.delete('/usuarios/:id', AuthMiddleware.verificarPermisos(['usuarios:eliminar']), UsuarioController.eliminar);

  api.put('/usuarios/cambiar-contrasena/:id', UsuarioController.cambiarContrasena);
  api.get('/usuarios/:id/cantidad-documentos', UsuarioController.cantidadDocumentosPorUsuario);
  api.get('/usuarios/:id/lista-documentos', UsuarioController.listaDocumentosPorUsuario);
  api.get('/usuarios/:id/lista-flujo-documental', UsuarioController.listaFlujoDocumentalPendientePorUsuario);

  api.patch('/usuarios/:id/horarios', AuthMiddleware.verificarPermisos(['usuarios:actualizar']), UsuarioController.actualizarHorarios);
  api.put('/usuarios/:id/cambiar-estado', AuthMiddleware.verificarPermisos(['usuarios:actualizar']), UsuarioController.cambiarEstado);
  api.post('/usuarios/importar', AuthMiddleware.verificarPermisos(['usuarios:crear']), UsuarioController.importar);
  api.get('/usuariosSearch', AuthMiddleware.verificarPermisos(['usuarios:listadoReducido']), UsuarioController.listadoReducido);
  api.get('/usuarios/:ci/sincronizar-srh', AuthMiddleware.verificarPermisos(['usuarios:crear']), UsuarioController.sincronizar);
  // api.put('/usuarios/cambiar/password', UsuarioController.cambiarTodasContrasenas);
  return api;
};
