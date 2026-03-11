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
  log.error('AuthMiddlware mensajeError');
  log.error(`code: ${code}`);
  log.error(`mensaje: ${mensaje}`);
  log.error(datos);
  return res.status(code || HTTP_CODES.BAD_REQUEST).json({
    finalizado : false,
    mensaje    : mensaje || 'ERROR',
    datos      : datos || null
  });
}

const AuthMiddleware = function (services) {
  const { AuthService, ApitokenEndpointService } = services;
  function verificarToken () {
    log.debug('verificarToken');
    return async function _middleware (req, res, next) {
      if (['/api/aprobacion/callback', '/api/ciudadania/callback'].includes(req.originalUrl)) return next();

      let data;
      let tokenRequest = null;
      try {
        if (!req.headers.authorization) throw new Error('No autorizado');

        tokenRequest = req.headers.authorization.replace('Bearer ', '');
        const parsedUrl = (req.originalUrl.split('/')[3] || '').split('?')[0];
        const iopAuthorized = await ApitokenEndpointService.getVerifiedRecord(tokenRequest, parsedUrl);
        if (iopAuthorized) {
          // retornando objeto similar al entregado por jwt.verify
          req.user = {
            token             : tokenRequest,
            idRoles           : [config.constants.Ids.roles.iop],
            idUsuario         : iopAuthorized.idUsuario,
            usuario           : iopAuthorized.dataValues.usuario.dataValues.usuario,
            idEntidad         : config.constants.Ids.entidad['MINISTERIO DE JUSTICIA'],
            celular           : iopAuthorized.dataValues.usuario.dataValues.celular,
            correoElectronico : iopAuthorized.dataValues.usuario.dataValues.correoElectronico,
            iop               : true,
            iat               : moment().add(2, 'hours').unix(),
            exp               : moment().add(1, 'hours').unix()
          };
          console.log(`Solicitud entrante (${req.user.usuario}): ${req.pathRequest}`);
          next();
        } else {
          try {
            data = await verify(tokenRequest, config.auth.secret, services);
            data.token = tokenRequest;
            req.user = data;
            console.log(`Solicitud entrante (${data.usuario}): ${req.pathRequest}`);
            next();
          } catch (error) {
            // token iop
            log.debug('Error verify');
            mensajeError(res, HTTP_CODES.UNAUTHORIZED, error.message);
          }
        }
      } catch (error) {
        mensajeError(res, HTTP_CODES.UNAUTHORIZED, error.message);
      }
    };
  }

  function verificarPermisos (permisos) {
    return async function _middleware (req, res, next) {
      if (req.user.iop) return next();

      try {
        const consulta = { roles: req.user.idRoles, permisos: permisos };

        // const tienePermiso = await AuthService.verificarPermisos(consulta);

        // if (!tienePermiso) throw new Error('No tiene permisos para realizar esta accion.');

        return next();
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
  return new AuthMiddleware(services);
};
