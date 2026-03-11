'use strict';

const fs = require('fs');
const path = require('path');
const array = require('./array');

function convertLinealObject (data) {
  let ob = {};
  for (let i in data) {
    for (let j in data[i]) {
      ob[j] = data[i][j];
    }
  }
  return ob;
}

// Función que se encarga de cargar todas las clases de un directorio
// y devolverlas en un objeto
function loadClass (PATH, exclude = ['index.js']) {
  let files = fs.readdirSync(PATH);
  let modules = {};
  array.removeAll(exclude, files);

  files.forEach(function (file) {
    let pathFile = path.join(PATH, file);
    if (!fs.statSync(pathFile).isDirectory()) {
      let module = require(pathFile);
      let nameClass = module.default.name;
      modules[nameClass] = module.default;
    }
  });

  return modules;
}

/**
 * Renombra propiedades de un objeto, deja intactas las que no son solicitadas para renombrar
 * @param obj(object)
 * @param props(object) Propiedades mapeadas de la forma:
 * { nombre_a_cambiar: "nuevoNombre", ... }
 * @return object
*/
function renameKeys (obj, props) {
  for (const oldKey of Object.keys(props)) {
    delete Object.assign(obj, { [`${props[oldKey]}`] : obj[oldKey] })[oldKey];
  }
  return obj;
}

module.exports = {
  loadClass,
  convertLinealObject,
  renameKeys,
};
