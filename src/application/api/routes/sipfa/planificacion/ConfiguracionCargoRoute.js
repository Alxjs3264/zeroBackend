'use strict';

module.exports = function setupPaso (api, controllers, middlewares) {
  const { ConfiguracionCargoController } = controllers;

  api.get('/configuracionCargo', ConfiguracionCargoController.findAll);
  api.get('/configuracionCargo/:id', ConfiguracionCargoController.mostrar);
  api.post('/configuracionCargo', ConfiguracionCargoController.crear);
  api.put('/configuracionCargo/:id', ConfiguracionCargoController.actualizar);
  api.delete('/configuracionCargo/:id', ConfiguracionCargoController.eliminar);

  return api;
};
