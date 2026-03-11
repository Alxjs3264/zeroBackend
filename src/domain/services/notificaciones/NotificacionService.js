'use strict';

const debug = require('debug')('app:service:auth');
const { config } = require('../../../common');
const { ErrorApp } = require('../../lib/error');
const axios = require('axios');

module.exports = function notificacionService (repositories, helpers, res) {
  const { ParametroRepository } = repositories;

  async function statusNotification () {
    const init = {
      method : 'GET',
      url    : `${config.app.notificaciones.BASE_URL}/public/status`
    };
    try {
      const { data } = await axios(init);
      return data.finalizado;
    } catch (error) {
      return false;
    }
  }

  async function enviarNotificacion (idUsuario, mensaje) {
    const estadoServicio = await statusNotification();
    if (estadoServicio) {
      try {
        const init = {
          method  : 'post',
          url     : `${config.app.notificaciones.BASE_URL}/api/notificaciones/suscripcion/enviar-notificacion`,
          headers : {
            Authorization  : config.app.notificaciones.TOKEN,
            'Content-Type' : 'application/json'
          },
          data: { mensaje, idUsuario }
        };

        const respuesta = await axios(init);
        return respuesta;
      } catch (err) {
        throw new ErrorApp(err.message, 400);
      }
    }
  }

  return {
    enviarNotificacion
  };
};
