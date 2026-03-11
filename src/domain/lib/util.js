'use strict';

const fs = require('fs');
const path = require('path');
const Response = require('./response');
const log = require('log4js').getLogger();
const { array, config } = require('../../common');
const { eliminarListaDeArchivos } = require('../../common/lib/archivos');
let res;

function loadHelpers (PATH) {
  const files = fs.readdirSync(PATH);
  let helpers = {};

  files.forEach(function (file) {
    const pathFile = path.join(PATH, file);
    if (fs.statSync(pathFile).isDirectory()) {
      helpers = Object.assign(helpers, loadHelpers(pathFile));
    } else {
      file = file.replace('.js', '');
      helpers[file] = require(pathFile)();
    }
  });
  return helpers;
}

/**
 * Cargando los repositorios en la carpeta especificada
 *
 * @param {string} PATH: Path del directorio de donde se cargará los modelos del sistema
 * @param {object} models: Objeto con todos los modelos de la bd
 * @param {object} res: objeto con respuestas predeterminadas
 * @param {object} opts: Json de configuración
 */
function loadServices (PATH, repositories, opts = {}, logs, helpers = {}) {
  if (!res) {
    res = Response(logs);
  }
  const files = fs.readdirSync(PATH);
  let services = {};

  if (opts.exclude) {
    array.removeAll(opts.exclude, files);
  }

  // para excluir tambien expresiones regulares
  if (opts.excludeRegex) {
    const excluir = [];
    opts.excludeRegex.map((re) => {
      const regExp = new RegExp(re);
      files.map((file) => {
        if (regExp.test(file)) {
          excluir.push(file);
        }
      });
    });
    if (excluir.length > 0) {
      array.removeAll(excluir, files);
    }
  }

  files.forEach(function (file) {
    const pathFile = path.join(PATH, file);
    if (fs.statSync(pathFile).isDirectory()) {
      services = Object.assign(services, loadServices(pathFile, repositories, opts, logs, helpers));
    } else {
      file = file.replace('.js', '');
      services[file] = require(pathFile)(repositories, helpers, res);
    }
  });

  return services;
}

function loadClasses (PATH, opts) {
  const files = fs.readdirSync(PATH);
  let classes = {};

  if (opts.exclude) {
    array.removeAll(opts.exclude, files);
  }

  // para excluir tambien expresiones regulares
  if (opts.excludeRegex) {
    const excluir = [];
    opts.excludeRegex.map((re) => {
      const regExp = new RegExp(re);
      files.map((file) => {
        if (regExp.test(file)) {
          excluir.push(file);
        }
      });
    });
    if (excluir.length > 0) {
      array.removeAll(excluir, files);
    }
  }

  files.forEach(function (file) {
    const pathFile = path.join(PATH, file);
    if (fs.statSync(pathFile).isDirectory()) {
      classes = Object.assign(classes, loadClasses(pathFile, opts));
    } else {
      file = file.replace('.js', '');
      classes[file] = require(pathFile);
    }
  });

  return classes;
}

function loadValidations (PATH, opts) {
  const files = fs.readdirSync(PATH);
  const valueObjects = {};

  if (opts.exclude) {
    array.removeAll(opts.exclude, files);
  }

  // para excluir tambien expresiones regulares
  if (opts.excludeRegex) {
    const excluir = [];
    opts.excludeRegex.map((re) => {
      const regExp = new RegExp(re);
      files.map((file) => {
        if (regExp.test(file)) {
          excluir.push(file);
        }
      });
    });
    if (excluir.length > 0) {
      array.removeAll(excluir, files);
    }
  }

  files.forEach(function (file) {
    const pathFile = path.join(PATH, file);
    if (fs.statSync(pathFile).isDirectory()) {
      valueObjects[file] = loadValidations(pathFile, opts);
    } else {
      file = file.replace('.js', '');
      valueObjects[file] = require(pathFile);
    }
  });

  return valueObjects;
}

const rollbackYLimpiarArchivos = async function (mensaje, err, transaction, t, archivosGuardados) {
  log.error('rollback y limpiar archivos.');
  log.error(mensaje);
  log.error('ERROR:');
  log.error(err);
  if (transaction) {
    await transaction.rollback(t);
  }
  eliminarListaDeArchivos(archivosGuardados);
  return mensaje;
};

const eliminarNoDefinidosONulos = function (data) {
  Object.keys(data).forEach(key => {
    if (data[key] === undefined || data[key] === null) {
      delete data[key];
    }
  });
};

/**
 * Dado un registro documento completo, obtiene los campos necesarios para devolver un documento reducido
 * @param doc object: Object de tipo Documento
 * @return object con las propiedades:
 * { id, codigoFlujo, cite, firmado, fechaEmitido, fechaAceptado, fechaCerrado, nombrePlantilla}
*/
const documentoReducido = function (documento) {
  let doc;
  if (documento.dataValues) doc = documento.dataValues;
  else doc = documento;

  log.debug(doc.id, doc.cite);
  return {
    id                     : doc.id,
    codigoFlujo            : doc.flujoDocumental ? doc.flujoDocumental.dataValues.codigoFlujo : null,
    cite                   : doc.cite,
    correlativo            : doc.correlativo,
    clasificacion          : doc.clasificacion,
    asunto                 : doc.asunto,
    firmado                : doc.firmado,
    fechaEmitido           : doc.fechaEmitido,
    fechaAceptado          : doc.fechaAceptado,
    fechaCerrado           : doc.fechaCerrado,
    nombrePlantilla        : doc.nombrePlantilla,
    remitidoPor            : doc.usuarioRemitente ? doc.usuarioRemitente.dataValues.numeroDocumento : null,
    destinatarioEspecifico :
    doc.usuarioDestinatario
      ? {
          numeroDocumento : doc.usuarioDestinatario ? doc.usuarioDestinatario.dataValues.numeroDocumento : null,
          nombres         : doc.usuarioDestinatario ? doc.usuarioDestinatario.dataValues.nombres : null,
          primerApellido  : doc.usuarioDestinatario ? doc.usuarioDestinatario.dataValues.primerApellido : null,
          segundoApellido : doc.usuarioDestinatario ? doc.usuarioDestinatario.dataValues.segundoApellido : null,
          area            : doc.usuarioDestinatario.dataValues.areas.length > 0
            ? doc.usuarioDestinatario.dataValues.areas[0].nombreArea
            : null
        }
      : null,
    destinatarioArea:
    doc.areaDestino ? doc.areaDestino.dataValues.nombreArea : null,
    citeDocumentoPadre:
    doc.documentoAntecesor ? doc.documentoAntecesor.dataValues.cite : null,
    estado: doc.estado
  };
};

/**
 * Dado un registro de usuario, obtiene los campos necesarios para devolver un usuario reducido
 * @param usuario object: de tipo usuario
 * @return object con las propiedades:
 * {
    "numeroDocumento": "8851812",
    "entidad": {
      "nombre": "Ministerio de justicia y transparencia institucional",
      "sigla": "MJTI"
    },
    "tipoDocumento": "CI",
    "nombres": "Juan Marcelo",
    "primerApellido": "Laguna",
    "segundoApellido": "Vernabe",
    "cargo": "asistente de jefe de unidad",
    "area": {
      "nombre": "LEGAL",
      "sigla": "LGL"
    },
    "estado": "ACTIVO"
  }
*/
const usuarioReducido = function (usuario) {
  let _usuario;
  if (usuario.dataValues) _usuario = usuario.dataValues;
  else _usuario = usuario;
  return {
    numeroDocumento : _usuario.numeroDocumento,
    entidad         : _usuario.entidad
      ? {
          nombre : _usuario.entidad.nombre,
          sigla  : _usuario.entidad.sigla
        }
      : {},
    tipoDocumento   : _usuario.tipoDocumento,
    nombres         : _usuario.nombres,
    primerApellido  : _usuario.primerApellido,
    segundoApellido : _usuario.segundoApellido,
    cargo           : _usuario.cargo,
    area            : _usuario.areas.length > 0
      ? {
          nombre : _usuario.areas[0].nombreArea,
          sigla  : _usuario.areas[0].sigla
        }
      : {},
    estado: _usuario.estado
  };
};

const iss = {
  issuer                 : `${config.openid.issuer}`,
  authorization_endpoint : `${config.openid.issuer}/auth`,
  token_endpoint         : `${config.openid.issuer}/token`,
  revocation_endpoint    : `${config.openid.issuer}/revocation`,
  registration_endpoint  : `${config.openid.issuer}/reg`,
  userinfo_endpoint      : `${config.openid.issuer}/me`,
  introspection_endpoint : `${config.openid.issuer}/token/introspection`,
  check_session_iframe   : `${config.openid.issuer}/session/check`,
  end_session_endpoint   : `${config.openid.issuer}/session/end`,
  // jwks_uri               : `${config.openid.issuer}/jwks`
  jwks_uri               : `${config.openid.issuer}/certs`
};

module.exports = {
  loadHelpers,
  loadServices,
  loadClasses,
  loadValidations,
  iss,
  rollbackYLimpiarArchivos,
  eliminarNoDefinidosONulos,
  documentoReducido,
  usuarioReducido
};
