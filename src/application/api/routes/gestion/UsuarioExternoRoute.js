'use strict';

module.exports = function setupParametro (api, controllers, middlewares) {
  const { UsuarioExternoController } = controllers;

  api.get('/usuario-externo', UsuarioExternoController.findAll);
  api.get('/usuario-externo/:id', UsuarioExternoController.mostrar);
  api.post('/usuario-externo', UsuarioExternoController.crear);
  api.put('/usuario-externo/:id', UsuarioExternoController.actualizar);
  api.delete('/usuario-externo/:id', UsuarioExternoController.eliminar);

  return api;
};
