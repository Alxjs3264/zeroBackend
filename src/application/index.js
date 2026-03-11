'use strict';

// Polyfill para File (necesario para undici/fetch en Node.js)
global.File = class File {
  constructor(bits, name, options = {}) {
    this._bits = bits;
    this.name = name;
    this.type = options.type || '';
    this.size = bits.reduce((acc, b) => acc + (b.length || b.byteLength || 0), 0);
    this.lastModified = options.lastModified || Date.now();
  }
};

const domain = require('../domain');
const log = require('log4js').getLogger();

module.exports = async function setupModule (settings = { iop: true }) {
  try {
    global.IOP = !!settings.iop;
    // Cargando Capa del dominio
    const services = await domain(settings);

    // Agregando Logs a los servicios
    // services.log = log.getLogger();
    services.log = log;

    services.log.info('Inicializando serivicios...', '\n', 'INFO...');
    // services.log.debug('Inciado módulo logs.', 'OTro mas');

    return {
      services,
      _models       : services._models,
      _repositories : services._repositories
    };
  } catch (err) {
    console.error(err);
    throw new Error(`Error al instanciar el módulo principal: ${err.message}`);
  }
};
