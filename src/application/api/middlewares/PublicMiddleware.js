const { verify } = require('../../lib/auth');
const { config } = require('../../../common');
const { constants } = require('../../../common/config');

const HTTP_CODES = {
  OK           : 200,
  CREATED      : 201,
  BAD_REQUEST  : 400,
  UNAUTHORIZED : 401,
  FORBIDDEN    : 403
};

function mensajeError (res, code, mensaje, datos) {
  return res.status(code || HTTP_CODES.BAD_REQUEST).json({
    finalizado : false,
    mensaje    : mensaje || 'ERROR',
    datos      : datos || null
  });
}

const PublicMiddleware = function (services) {
  const { AuthService } = services;
  function verificarToken () {
    return async function _middleware (req, res, next) {
      let data;
      let tokenRequest = null;
      try {
        if (!req.headers.authorization) throw new Error('No autorizado');

        tokenRequest = req.headers.authorization.replace('Bearer ', '');

        data = await verify(tokenRequest, config.auth.secret);

        req.user = data;

        next();
      } catch (error) {
        mensajeError(res, HTTP_CODES.UNAUTHORIZED, error.message);
      }
    };
  }

  function verificarPermisos (permisos) {
    return async function _middleware (req, res, next) {
      try {
        const consulta = {
          idUsuario : req.user.idUsuario,
          idEntidad : req.user.idEntidad,
          permisos  : permisos
        };

        const tienePermiso = await AuthService.verificarPermisosAplicacion(consulta);

        if (!tienePermiso) throw new Error('No tiene permisos para realizar esta accion.');

        next();
      } catch (error) {
        mensajeError(res, HTTP_CODES.UNAUTHORIZED, error.message);
      }
    };
  }

  return {
    verificarToken,
    verificarPermisos
  };
};

module.exports = function (services) {
  return new PublicMiddleware(services);
};
