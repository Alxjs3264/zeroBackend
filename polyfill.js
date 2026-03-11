

// polyfill.js - se ejecuta antes de todo

const dotenv = require('dotenv');

dotenv.config({ path: '/var/www/backend-gestion-documental/.env' });


// Debug para confirmar que .env se leyó
console.log('[polyfill] dotenv cargado');
console.log('[polyfill] DB_USER:', process.env.DB_USER || 'NO DEFINIDO');
console.log('[polyfill] DB_PASS:', process.env.DB_PASS ? '***' : 'NO DEFINIDO');
console.log('[polyfill] DB_NAME:', process.env.DB_NAME || 'NO DEFINIDO');

global.File = class File {
  constructor(bits, name, options = {}) {
    this._bits = bits;
    this.name = name;
    this.type = options.type || '';
    this.size = bits.reduce((acc, b) => acc + (b.length || b.byteLength || 0), 0);
    this.lastModified = options.lastModified || Date.now();
  }
};

// Opcional: polyfill para otras Web APIs si es necesario
global.Blob = class Blob {
  constructor(bits, options) {
    this._bits = bits;
    this.type = options.type || '';
    this.size = bits.reduce((acc, b) => acc + b.length, 0);
  }
};

console.log('[polyfill] File polyfill cargado');
