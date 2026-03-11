const log = require('log4js').getLogger();
const moment = require('moment');
const { verify } = require('../../lib/auth');
const { config } = require('../../../common');

const HTTP_CODES = {
  OK           : 200,
  CREATED      : 201,
  BAD_REQUEST  : 400,
  UNAUTHORIZED : 401,
  FORBIDDEN    : 403
};

function mensajeError (res, code, mensaje, datos) {
  log.error('AprobacionCiudadaniaMiddleware mensajeError');
  log.error(`code: ${code}`);
  log.error(`mensaje: ${mensaje}`);
  log.error(datos);
  return res.status(code || HTTP_CODES.BAD_REQUEST).json({
    finalizado : false,
    mensaje    : mensaje || 'ERROR',
    datos      : datos || null
  });
}

const AprobacionPostMiddleware = function () {
  function verificarToken () {
    return function _middleware (req, res, next) {
      let tokenRequest = null;
      if (!req.headers.authorization) {
        throw new Error('Notificación de resultado aprobación con ciudadanía digital no autorizada');
      }
      tokenRequest = req.headers.authorization.replace('Bearer ', '');
      if (tokenRequest !== config.openid.aprobacion.postSecret) {
        throw new Error('Notificación de resultado aprobación con ciudadanía digital con token no autorizado');
      }
      next();
    };
  }

  return { verificarToken };
};

module.exports = function (services) {
  return new AprobacionPostMiddleware(services);
};
