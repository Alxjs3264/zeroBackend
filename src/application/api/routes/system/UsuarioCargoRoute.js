'use strict';

module.exports = function setupSocio (api, controllers, middlewares) {
  const { UsuarioCargoController } = controllers;
  const { AuthMiddleware } = middlewares;

  api.get('/usuario-cargo',  UsuarioCargoController.listar);
  api.get('/usuario-cargo/:id',  UsuarioCargoController.mostrar);
  api.post('/usuario-cargo/',  UsuarioCargoController.crear);
  api.put('/usuario-cargo/:id',  UsuarioCargoController.actualizar);
  api.delete('/usuario-cargo/:id',  UsuarioCargoController.eliminar);

  api.get('/usuario-cargo-reporte',  UsuarioCargoController.listarReporte);

  return api;
};
