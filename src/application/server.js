'use strict';

require('dotenv').config();

global.File = class File {
  constructor(bits, name, options = {}) {
    this._bits = bits;
    this.name = name;
    this.type = options.type || '';
    this.size = bits.reduce((acc, b) => acc + (b.length || b.byteLength || 0), 0);
    this.lastModified = options.lastModified || Date.now();
  }
};

const debug = require('debug')('app:app');
const log4js = require('log4js');
const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const https = require('https');
const App = require('./');
const ip = require('./lib/ip');
const { errors } = require('../common');
const api = require('./api');
const app = express();
const { logsConfig, appPort } = require('../common/config/app.js');

const port = appPort ?? 3053;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

// configurando Logs
log4js.configure({
  appenders: {
    console : { type: 'console' },
    file    : {
      type       : 'file',
      filename   : logsConfig.path,
      maxLogSize : logsConfig.maxLogSize,
      backups    : logsConfig.backups
    }
  },
  categories: {
    default: {
      appenders : ['console', 'file'],
      level     : logsConfig.level
    },
    console: {
      appenders : ['console'],
      level     : logsConfig.level
    }
  }
});

const log = log4js.getLogger();
log.info('Logs configurados! 🐖  🐖  🐖');

app.use(bodyParser.json({ limit: '15mb' }), (err, req, res, next) => {
  if (err.message) {
    log.error('Error bodyParser.json()');
    log.debug(err.message);
  }
});
app.use(cors());
app.use(fileUpload());
// Middleware para ver las peticiones
app.use((req, res, next) => {
  req.pathRequest = `${req.method} ${req.url}`;
  // console.log(`Token: ${req.headers.authorization}`);
  next();
});

app.use(express.static('public'));

app.use(ip().getIpInfoMiddleware);

(async function (app) {
  // Cargando servicios
  let services = {};

  // Cargando módulo de usuarios que tiene servicios, api
  const application = await App({ iop: false });

  services = Object.assign(services, application.services);

  // Iniciando API-REST
  app = await api(app, services);

  // Express Error Handler
  app.use((err, req, res, next) => {
    debug(chalk.red(`[ERROR]: ${err.message}`));
    services.log.error('\nAPI error', err.message, '\nDetail:', err);
    // services.Log.error(err.message, 'API', err);

    if (err.message) {
      if (err.message.match(/not found/)) {
        return res.status(404).send({ error: err.message });
      }

      if (err.message.match(/jwt expired/)) {
        return res.status(401).send({ error: 'Su sesión ha expirado, ingrese nuevamente al sistema.' });
      }

      if (err.message.match(/No authorization/)) {
        return res.status(403).send({ error: 'No tiene permisos para realizar esta operación.' });
      }

      if (err.message.match(/EAI_AGAIN/)) {
        return res.status(400).send({ error: 'Uno de los servicios no se encuentra activo en estos momentos, vuelva a intentar dentro de unos minutos.' });
      }
    }
    res.status(500).send({ error: err.message });
  });
})(app);

process.on('uncaughtException', errors.handleFatalError);
process.on('unhandledRejection', errors.handleFatalError);

if (process.env.NODE_ENV === 'secure') {
  const options = {
    cert : fs.readFileSync(`${path.join(__dirname, '../../ssl')}/server.crt`),
    key  : fs.readFileSync(`${path.join(__dirname, '../../ssl')}/server.key`)
  };
  https.createServer(options, app).listen(port, () => {
    console.log(`Iniciando servidor HTTPS en el puerto ${port} `);
  });
} else {
  const server = http.createServer(app);
  server.listen(port, () => {
    console.log(`${chalk.green('[base-app]')} server listening on port ${port}`);
  });
}

// const options = {
//   cert : fs.readFileSync(`${path.join(__dirname, '../../ssl')}/server.crt`),
//   key  : fs.readFileSync(`${path.join(__dirname, '../../ssl')}/server.key`)
// };

// https.createServer(options, app).listen(port, () => {
//   console.log(`Iniciando servidor HTTPS en el puerto ${port} `);
// });
