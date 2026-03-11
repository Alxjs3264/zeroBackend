'use strict';

const fileSystem = require('fs');
const path = require('path');
const moment = require('moment');
const log = require('log4js').getLogger();
const ejs = require('ejs');
const wkhtmltopdf = require('wkhtmltopdf');
const { constants, app } = require('../../common/config');
if (process.platform === 'win32') {
  wkhtmltopdf.command = 'C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe';
} else {
  wkhtmltopdf.command = 'wkhtmltopdf';
}

function decodeB64(b64) {
  return Buffer.from(b64, 'base64');
}

function encodeB64(data) {
  return data.toString('base64');
  // return Buffer.from(data).toString('base64');
}

function nombrarArchivo(prefijo, _nombre, extension) {
  const centro = _nombre.replace(' ', '-').replace('.', '-').replace('_', '-');
  const fechaHora = moment().format('DDMMYYYY-HHmmss');
  return `${prefijo}_${centro}_${fechaHora}.${extension}`;
};

/**
 * Guarda un archivo en el sistema de archivos y retorna la ruta y el nombre.
 */
function guardarArchivoB64(prefijo, _nombre, extension, contenido) {
  if (!contenido || contenido.length < 1) {
    throw new Error(`Error guardando archivo: ${_nombre} no tiene contenido`);
  }
  if (contenido.startsWith('data:')) {
    log.debug('------ mime type -----');
    log.debug(contenido.split(';base64,')[0]);
    contenido = contenido.split(';base64,')[1];
  }
  if (Object.keys(constants.fileExtensionsAndFolders).indexOf(extension.toLowerCase()) === -1) { throw new Error(`Extensión ${extension} no es soportada.`); }

  const nombre = nombrarArchivo(prefijo, _nombre, extension);
  const ruta = path.join(
    app.fileStoragePath,
    constants.fileExtensionsAndFolders[extension.toLowerCase()] + nombre
  );

  try {
    fileSystem.writeFileSync(ruta, decodeB64(contenido), { encoding: 'binary' });
    return { nombre, ruta };
  } catch (err) {
    log.error(`Error guardando archivo: ${nombre} en ${ruta}`);
    log.error(err);
    throw new Error(`Error guardando archivo: ${nombre} en ${ruta}`);
  }
}

function eliminarArchivo(nombre) {
  const ruta = path.join(
    app.fileStoragePath,
    constants.fileExtensionsAndFolders[nombre.split('.')[1].toLowerCase()] + nombre);
  log.debug(`Elminando archivo: ${ruta}`);
  try {
    fileSystem.unlinkSync(ruta);
  } catch (err) {
    log.error(`Error eliminando archivo ${nombre}: ${ruta}\n:${err}`);
    throw new Error(`Error eliminando archivo ${nombre}: ${ruta}\n:${err}`);
    // TODO: Analizar que hacer cuando ocurre este caso
  }
}

function eliminarListaDeArchivos(archivosGuardados) {
  for (const archivo of archivosGuardados) {
    try {
      eliminarArchivo(archivo);
    } catch (err) {
      log.error(err);
    }
  }
}

function obtenerArchivo(nombre) {
  let ruta;
  try {
    ruta = path.join(
      app.fileStoragePath,
      constants.fileExtensionsAndFolders[nombre.split('.')[1].toLowerCase()] + nombre);
    log.debug(`Buscando archivo: ${nombre}, ruta=${ruta}`);
  } catch (err) {
    log.error(`Error obteniendo ruta para archivo ${nombre}`);
    log.error(err);
    throw new Error(`Error obteniendo archivo ${nombre}`);
  }

  try {
    const datos = fileSystem.readFileSync(ruta);
    return encodeB64(datos);
  } catch (e) {
    log.error(`Error obteniendo archivo: ${nombre}`);
    log.error(e);
    throw new Error(`Error obteniendo archivo: ${nombre}`);
  }
}
function esPath(str) {
  const parsedPath = path.parse(str);
  return (parsedPath.root !== '' && parsedPath.dir !== '');
}
function obtenerPdfGenerado(nombre) {
  let ruta;
  try {
    if (!esPath(nombre)) {
      ruta = path.join(app.fileStoragePath, 'documentos', 'generados', 'pdf', nombre);
      ruta = path.resolve(ruta);
    } else {
      ruta = nombre;
    }
  } catch (err) {
    log.error(`Error obteniendo ruta para archivo ${nombre}`);
    log.error(err);
    throw new Error(`Error obteniendo archivo ${nombre}`);
  }

  try {
    const datos = fileSystem.readFileSync(ruta);
    return datos;
    // return encodeB64(datos);
  } catch (e) {
    log.error(`Error obteniendo archivo: ${nombre}`);
    log.error(e);
    throw new Error(`Error obteniendo archivo: ${nombre}`);
  }
};
function eliminarPdfGenerado(nombre) {
  let ruta;
  try {
    ruta = path.join(app.fileStoragePath, 'documentos', 'generados', 'pdf', nombre);
    ruta = path.resolve(ruta);
  } catch (err) {
    log.error(`Error obteniendo ruta para archivo ${nombre}`);
    log.error(err);
    throw new Error(`Error obteniendo archivo ${nombre}`);
  }
  try {
    fileSystem.renameSync(ruta, path.join(app.fileStoragePath, 'documentos', 'generados', 'borrados', `BORRADO-${nombre}`));
  } catch (err) {
    log.error(`Error eliminando archivo ${nombre}: ${ruta}\n:${err}`);
  }
};
function calcularVisibleDerivacion(configuracion, tipo, tipoConfig, totalValores) {
  if (configuracion[tipoConfig]?.multiple && configuracion[tipoConfig]?.visible) return totalValores.valores[tipo].some(x => x?.visiblePdf === true);
  if (!configuracion[tipoConfig]?.multiple && configuracion[tipoConfig]?.visible) return totalValores.valores[tipo]?.visiblePdf;
}
async function createPdf(html, pdfOptions = {}, header, footer) {
  const opt = {
    headerHtml: header,
    footerHtml: footer,
    footerSpacing: 2,
    pageSize: pdfOptions.pageSize || 'letter',
    marginLeft: pdfOptions.marginLeft || '4cm',
    marginRight: pdfOptions.marginRight || '3cm',
    marginTop: pdfOptions.marginTop || '3cm',
    marginBottom: pdfOptions.marginBottom || '4cm',
    output: pdfOptions.output || '/tmp/documento.pdf',

//añadido por mi para qeu funcione la impresion en local
    enableLocalFileAccess: true,
    'disable-smart-shrinking': true,
    'no-stop-slow-scripts': true,
    'javascript-delay': 1000,
    'load-error-handling': 'ignore',
    'load-media-error-handling': 'ignore',
    debug: true,
    quiet: false

  };

  console.log('🖨️  Generando PDF con wkhtmltopdf');
  console.log('   Output:', opt.output);
  console.log('   Header:', header ? 'Sí' : 'No');
  console.log('   Footer:', footer ? 'Sí' : 'No');

  return new Promise((resolve, reject) => {
    wkhtmltopdf(html, opt, (err) => {
      if (err) { 
        console.error('❌ Error wkhtmltopdf:', err.message);
        return reject(err); 
      }
      console.log('✅ PDF generado');
      resolve();
    });
  });
}

async function documentoPdfGenerar(nombre, id, repositories, helpers, leer = true, idUsuario) {
  let ruta;
  let file;
  const { FlujoDocumentalRepository, ArchivoAdjuntoRepository, ReferenciaDocumentoRepository } = repositories;
  const { PdfMergeHelper } = helpers;
  try {
    const contenidoDocumento = fileSystem.readFileSync(`${app.fileStoragePath}/documentos/temporales/${id}.json`);
    const documento = JSON.parse(contenidoDocumento);
    try {
      ruta = path.join(app.fileStoragePath, 'documentos', 'generados', 'pdf', nombre);
      file = path.join('documentos', 'generados', 'pdf', nombre);
      ruta = path.resolve(ruta);
    } catch (err) {
      log.error(`Error obteniendo ruta para archivo ${nombre}`);
      log.error(err);
      throw new Error(`Error obteniendo archivo ${nombre}`);
    }
    const referencias = await ReferenciaDocumentoRepository.findAll({ idDocumento: id });
    const adjuntos = await ArchivoAdjuntoRepository.findAll({ idDocumento: id });
    let edit = false;
    if (!fileSystem.existsSync(ruta) && leer) {
      try {
        ruta = path.join(app.fileStoragePath, 'documentos', 'generados', 'pdf', `BORRADOR-${nombre}`);
        file = path.join('documentos', 'generados', 'pdf', `BORRADOR-${nombre}`);
        ruta = path.resolve(ruta);
      } catch (err) {
        log.error(`Error obteniendo ruta para archivo ${nombre}`);
        log.error(err);
        throw new Error(`Error obteniendo archivo ${nombre}`);
      }
      edit = true;
    }
    if (!fileSystem.existsSync(ruta) || edit) {
      for (const componente of documento.plantilla.configuracion_json) {
        if (componente.type === 'derivacion') {
          componente.configuracion.configDe.visiblePdf = calcularVisibleDerivacion(componente.configuracion, 'de', 'configDe', componente.value);
          componente.configuracion.configVia.visiblePdf = calcularVisibleDerivacion(componente.configuracion, 'via', 'configVia', componente.value);
          componente.configuracion.configPara.visiblePdf = calcularVisibleDerivacion(componente.configuracion, 'para', 'configPara', componente.value);
        }
        if (componente.type === 'libroHR') {
          const { rows } = await FlujoDocumentalRepository.findAllBook(componente.value.valores);
          componente.value.valores.rows = rows.map(row => row.dataValues);
        }
      }
      const html = await ejs.renderFile(path.resolve(`${app.rootPath}/../../views/documento.ejs`), {
        documento: documento,
        referencias: referencias,
        adjuntos: adjuntos,
        marginLeft: (documento?.plantilla?.configuracionPagina?.margenIzquierdo || 4) + 'cm',
        marginRight: (documento?.plantilla?.configuracionPagina?.margenDerecho || 3) + 'cm',
        shortCodes: {}
      });
      const header = `${app.BACKEND_URL_LOCAL}/public/generarHeaderPdfDocumento/${documento.id}?idUsuario=${idUsuario}`;
      const footer = `${app.BACKEND_URL_LOCAL}/public/generarFooterPdfDocumento?tipo=${documento.plantilla.idCategoria}&id=${documento.id}&idUsuario=${idUsuario}`;
      // const header = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSI4MHB4IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjI0cHgiIGZpbGw9IiM0NDQ0NDQiPkhlYWRlciAtIFBydWViYSBsb2NhbDwvdGV4dD48L3N2Zz4=";
      // const footer = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSI1MHB4IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE0cHgiIGZpbGw9IiM2NjY2NjYiPkZvb3RlciAtIFBydWViYSBsb2NhbCAtIHBhZ2luYSB7cGFnZX0gb2Yge3BhZ2VzfTwvdGV4dD48L3N2Zz4=";
      
      const options = {
        pageSize: documento?.plantilla?.configuracionPagina?.tamanioPagina?.nombre === 'OFICIO' ? 'legal' : 'letter' || 'letter',
        marginLeft: '0cm',
        marginRight: '0cm',
        marginTop: (documento?.plantilla?.configuracionPagina?.margenSuperior || 1) + 'cm',
        marginBottom: (documento?.plantilla?.configuracionPagina?.margenInferior || 1) + 'cm',
        output: ruta
      };
      await createPdf(html, options, header, footer);
      const uploadFilter = documento.plantilla.configuracion_json.filter(d => d.type === 'upload' && d.typeInput === 'pdf' && d.mergePdf);
      const listFile = [];
      listFile.push(ruta);
      uploadFilter.forEach(upload => {
        upload.value.valores.forEach(merge => {
          const filenameUpload = merge.value.split('/').pop();
          const filepathUpload = `files/documentos/uploads/${filenameUpload}`;
          listFile.push(path.join(process.cwd(), filepathUpload));
        });
      });
      await PdfMergeHelper.mergeDocument(listFile, ruta);
      const file = fileSystem.statSync(ruta).size;
      console.log('==========_TAMAÑO_DE_ARCHIVO_==========');
      console.log(file / (1024 * 1024), file);
      if (file / (1024 * 1024) > 8) throw new Error('Error de la Agetic, no permite enviar documentos mayores a 8MB para su aprobación.');
    }
    let respuesta = file;
    if (leer) respuesta = fileSystem.readFileSync(ruta, 'base64');
    return respuesta;
  } catch (error) {
    if (fileSystem.existsSync(ruta)) fileSystem.renameSync(ruta, path.join(app.fileStoragePath, 'documentos', 'generados', 'borrados', `${id}-BORRADO.pdf`));
    throw new Error(error.message);
  }
}

function documentoJsonGenerar(documento) {
  fileSystem.writeFileSync(`${app.fileStoragePath}/documentos/temporales/${documento.id}.json`, JSON.stringify(documento));
}

function obtenerArchivoB64(nombre) {
  return encodeB64(obtenerArchivo(nombre));
}

function obtenerPdfGeneradoB64(nombre) {
  return encodeB64(obtenerPdfGenerado(nombre));
}

function templateEjsConciliacion(template) {
  const pathfile = path.join('src/views/conciliacion', template);
  log.debug(`obteniendo template ejs ${pathfile}`);
  try {
    const data = fileSystem.readFileSync(pathfile);
    return data;
  } catch (err) {
    log.error('Error leyendo archivo');
    log.error(err);
    throw new Error(`Error leyendo archivo ${pathfile}: ${err.message}`);
  }
}

function checkDirecory(path) {
  if (!fileSystem.existsSync(path)) {
    fileSystem.mkdirSync(path, { recursive: true });
  }
}

function guardarPdfContentB64(nombre, data) {
  let ruta;
  try {
    ruta = path.join(app.fileStoragePath, 'documentos', 'generados', 'pdf', 'firmado', 'data');
    ruta = path.resolve(ruta);
    checkDirecory(ruta)
    ruta = path.join(ruta, nombre);
    ruta = path.resolve(ruta);
  } catch (err) {
    log.error(`Error obteniendo ruta para archivo ${nombre}`);
    log.error(err);
    throw new Error(`Error obteniendo archivo ${nombre}`);
  }
  try {
    fileSystem.writeFileSync(ruta, data);
  } catch (error) {
    console.log(error);
    log.error(error);
    throw new Error(`Error guardando el contenido del archivo ${nombre}`);
  }
}

function eliminarPdfContentB64(nombre) {
  let filePath = '';
  try {
    filePath = path.resolve(path.join(app.fileStoragePath, 'documentos', 'generados', 'pdf', 'firmado', 'data', nombre));
    if (fileSystem.existsSync(filePath)) {
      fileSystem.unlinkSync(filePath);
    }
  } catch (err) {
    console.error('Error al eliminar el archivo B64:', err);
    throw err;
  }
}

function guardarPdfAprobado(nombre) {
  try {
    const base = path.resolve(path.join(app.fileStoragePath, 'documentos', 'generados', 'pdf', 'firmado'));
    checkDirecory(base)
    const origen = path.resolve(path.join(app.fileStoragePath, 'documentos', 'generados', 'pdf', nombre))
    const destino = path.resolve(path.join(app.fileStoragePath, 'documentos', 'generados', 'pdf', 'firmado', nombre))
    fileSystem.copyFileSync(origen, destino)
    return destino
  } catch (error) {
    console.error('Error sacar respaldo del documento aprobado:', err);
    throw new Error(`Error guardando el respaldo aprobado, del documento ${nombre}`);
  }
}
module.exports = {
  nombrarArchivo,
  guardarArchivoB64,
  eliminarArchivo,
  eliminarListaDeArchivos,
  obtenerArchivo,
  obtenerArchivoB64,
  obtenerPdfGeneradoB64,
  obtenerPdfGenerado,
  documentoJsonGenerar,
  documentoPdfGenerar,
  eliminarPdfGenerado,
  templateEjsConciliacion,
  guardarPdfContentB64,
  eliminarPdfContentB64,
  guardarPdfAprobado
};
