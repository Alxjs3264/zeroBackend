'use strict';

const debug = require('debug')('app:api');
const log = require('log4js').getLogger();
const chalk = require('chalk');
const routes = require('./routes');
const { loadControllers, loadMiddlewares } = require('../lib/util');
const path = require('path');

module.exports = async function setupApi (app, services) {
  debug('Iniciando API-REST');

  // Load controllers
  const controllers = loadControllers(path.join(__dirname, 'controllers'), services);

  const middlewares = loadMiddlewares(path.join(__dirname, 'middlewares'), services);

  const { AuthMiddleware, AprobacionCiudadaniaMiddleware } = middlewares;
  /// para verficar con token

  app.get('/api/ciudadania-callback', (req, res) => {
    const { code, state, session_state } = req.query;
    res.redirect(`http://localhost:8080/statics/oauth/login.html?code=${code}&state=${state}&session_state=${session_state}`);
  });

  // Load routes
  app.use('/api', routes(controllers, middlewares));

  app.get('/public/documento/:cite/campos', controllers.DocumentoController.valoresDocumento);

  // app.use('/api/*', AuthMiddleware.verificarToken());

  app.use(function (err, req, res, nxt) {
    if (err.code === 'invalid_token') {
      log.info('Invalid Token\n', err);
      res.status(403).send({
        finalizado : false,
        mensaje    : 'No autorizado',
        datos      : null
      });
    }
    if (err.code === 'permission_denied') {
      log.info('Permission denied\n', err);
      res.status(403).send({
        finalizado : false,
        mensaje    : 'No tiene permisos para realizar esta accion',
        datos      : null
      });
    }
  });

  // aprobacion ciudadania Route
  console.log('🚀  ' + chalk.yellow('RUTAS: ') + chalk.redBright('APROBACIÓN CIUDADANÍA'));
  app.post('/ciudadania/aprobacion', AprobacionCiudadaniaMiddleware.verificarToken(), controllers.AprobacionDocumentosController.notificacionAprobacion);

  console.log(' -', { method: 'POST', url: '/ciudadania/aprobacion' });
  console.log('🚀  ' + chalk.yellow('RUTAS: ') + chalk.redBright('AUTH'));
  app.post('/auth/login', controllers.AuthController.login);
  console.log('🚀  ' + chalk.yellow('RUTAS: ') + chalk.redBright('AUTH'));
  app.get('/autorizar', controllers.AuthController.autorizar);
  app.get('/codigo', controllers.AuthController.codigo);
  app.post('/logout', controllers.AuthController.logout);
  app.get('/parametricas', controllers.ParametroController.findAll);
  app.get('/api/public/calcular/:operacion', (req, res, next) => {
    const precision = req.body?.precision || 2;
    const operacion = req.params.operacion.toUpperCase();
    let firstValue;
    const secondValue = parseFloat(req.body.secondValue) || 0;
    if (!Array.isArray(req.body.firstValue)) {
      firstValue = [(parseFloat(req.body.firstValue) || 0)]
    } else {
      firstValue = req.body.firstValue
    }
    if (req.body.secondValue) {
      firstValue.push(parseFloat(req.body.secondValue))
    }
    let result = parseFloat(firstValue.shift())
    firstValue.forEach(item => {
      switch (operacion) {
        case 'SUMA':
          result = result + parseFloat(item)
          break;
        case 'RESTA':
          result = result - parseFloat(item)
          break;
        case 'MULTIPLICACION':
          result = result * parseFloat(item)
          break;
        case 'DIVISION':
          try {
            result = result / parseFloat(item)
          } catch (error) {
            throw new Error("Error: División entre cero no permitida")
          }
          break;
      }      
    });
    return res.status(200).send({
      finalizado : true,
      mensaje    : 'Funcionando correctamente',
      datos      : {
        resultado: parseFloat(result.toFixed(precision))
      }
    });
  });

  // app.post('/auth/login', controllers.AuthController.login);
  app.get('/public/status', (req, res, next) => {
    return res.status(200).send({
      finalizado : true,
      mensaje    : 'Funcionando correctamente',
      datos      : {
        mensaje: 'Nuevo mensaje a reemplazar'
      }
    });
  });

  app.get('/public/status/:nombre', (req, res, next) => {
    const date = new Date();
    return res.status(200).send({
      finalizado : true,
      mensaje    : 'Funcionando correctamente',
      datos      : {
        mensaje : 'Nuevo mensaje a reemplazar',
        valores : { datos: 'mdkmmkl' },
        code    : Buffer.from(date.toString()).toString('base64'),
        anio    : date.getFullYear(),
        mes     : date.getMonth() + 1,
        dia     : date.getDate()
      }
    });
  });

  app.post('/public/upload', controllers.DocumentoController.subirArchivo);
  app.get('/public/generarHeaderPdfDocumento/:id', controllers.DocumentoController.generarHeaderPdf);
  app.get('/public/generarHeaderPdfDocumentofisico/:id', controllers.DocumentoController.generarHeaderPdfisico);
  app.get('/public/generarFooterPdfDocumento', controllers.DocumentoController.generarFooterPdf);
  app.get('/public/verificar', controllers.DocumentoController.verificar);
  app.get('/files/:file', controllers.DocumentoController.vistaArchivo);

  console.log(' -', { method: 'GET', url: '/public/status' });
  console.log(' -', { method: 'POST', url: '/auth/login' });
  console.log(' -', { method: 'POST', url: '/auth/refresh-token' });

  return app;
};
