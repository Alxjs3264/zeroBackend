const debug = require('debug')('app:service:documentoService');
const moment = require('moment');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const { config } = require('../../../common');
const { ErrorApp } = require('../../lib/error');
const { documentoReducido } = require('../../lib/util');
const { BITACORA } = require('../../../common/config/constants');
const wkhtmltopdf = require('wkhtmltopdf');
const mime = require('mime-types');
const HTMLtoDOCX = require("html-to-docx");
const puppeteer = require('puppeteer');
const docx = require("docx");
const cheerio = require('cheerio');
const sizeOf = require("image-size");
const { PDFDocument } = require('pdf-lib');
const { execSync } = require('child_process');
const QRCode = require("qrcode");
const { fromBuffer } = require("pdf2pic");
const jsQR = require("jsqr");
const { createCanvas, loadImage } = require("canvas");
const axios = require('axios');

let browser;
async function initBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }
  return browser;
}

async function htmlToImage(html, selector = '#render-container') {
  const browser = await initBrowser();
  const page = await browser.newPage();

  // Cargar el HTML
  await page.setContent(html, { waitUntil: 'networkidle0' });

  // Obtener el elemento que quieres capturar
  const element = await page.$(selector);
  if (!element) {
    throw new Error(`No se encontró el selector: ${selector}`);
  }

  // Capturar solo ese elemento
  const buffer = await element.screenshot({ type: 'png' });

  await page.close();
  return buffer; // devuelve el buffer de la imagen
}

function esHTML(cadena) {
  return /<\/?[a-z][\s\S]*>/i.test(cadena.trim());
}

function rgbStringToHex(input, options = {}) {
  const { withHash = true, includeAlpha = false } = options;
  if (!input || typeof input !== "string") return null;
  const m = input
    .replace(/\s+/g, "")
    .match(/^rgba?\(([^)]+)\)$/i);
  if (!m) return null;

  const parts = m[1].split(",");
  if (parts.length < 3) return null;

  const toByte = (v) => {
    if (v.endsWith("%")) {
      const p = parseFloat(v.slice(0, -1));
      return Math.round(Math.max(0, Math.min(100, p)) * 2.55);
    }
    const n = parseFloat(v);
    return Math.round(Math.max(0, Math.min(255, n)));
  };

  const r = toByte(parts[0]);
  const g = toByte(parts[1]);
  const b = toByte(parts[2]);

  const toHex2 = (n) => n.toString(16).toUpperCase().padStart(2, "0");

  let hex = `${toHex2(r)}${toHex2(g)}${toHex2(b)}`;

  if (parts.length === 4) {
    let aRaw = parts[3];
    let alpha = 1;
    if (aRaw.endsWith("%")) {
      alpha = Math.max(0, Math.min(100, parseFloat(aRaw.slice(0, -1)))) / 100;
    } else {
      alpha = Math.max(0, Math.min(1, parseFloat(aRaw)));
    }
    if (includeAlpha) {
      const aByte = Math.round(alpha * 255);
      hex = `${hex}${toHex2(aByte)}`;
    }
  }

  return withHash ? `#${hex}` : hex;
}

function getNodosFromHTML(html, children, isLabel = false) {
  const $ = cheerio.load(html, null, false);  
  // console.log('>>> HTML: ', html);
  
  const parseParagraph = (el) => {
    // console.log('====>>> CHILD', el.type, el.name, `--${$(el).text()}--`, `::${el.data}::`);
    const style = $(el).attr("style") || "";
    const alignMatch = style.match(/text-align\s*:\s*(\w+)/);
    const fontWeightMatch = style.match(/font-weight\s*:\s*(\w+)/);
    let _fontSizeMatch = style.match(/font-size\s*:\s*(\d+)px/);
    let _fontSize = _fontSizeMatch ? parseInt(_fontSizeMatch[1]) : 12;
    let alignment = docx.AlignmentType.LEFT;

    const align = alignMatch ? alignMatch[1] : "justify";
    const bold = fontWeightMatch ? fontWeightMatch[1] === "bold" : false;

    const colorMatch = style.match(/color\s*:\s*([^;]+)/);
  
    let color = colorMatch ? colorMatch[1].trim() : undefined;
    if (color) {
      color = color.includes('#') ? color.replace('#', '') : rgbStringToHex(color, { withHash: false })
    }

    if (align === "center") alignment = docx.AlignmentType.CENTER;
    else if (align === "right") alignment = docx.AlignmentType.RIGHT;
    else if (align === "left") alignment = docx.AlignmentType.LEFT;
    else if (align === "justify") alignment = docx.AlignmentType.JUSTIFIED;
    const runs = [];
    let breakLines = 0;
    if (el.type === "text" && el.data.trim() !== "") {
      // runs.push(new docx.TextRun(el.data));
      runs.push(new docx.TextRun({ text: el.data, color, bold: bold, size: (_fontSize * 1.85) }));
    } else {
      $(el)
        .contents()
        .each((i, child) => {
          const _style = $(child).attr("style") || "";
          const _fontWeightMatch = _style.match(/font-weight\s*:\s*(\w+)/);
          const _bold = _fontWeightMatch ? _fontWeightMatch[1] === "bold" : false;
          const _colorMatch = _style.match(/color\s*:\s*([^;]+)/);
  
          let _color = _colorMatch ? _colorMatch[1].trim() : color;
          // if (typeof color === 'undefined') {
          //   _color = $(child).attr("color") || undefined;
          // }
          // console.log({color, _color});
          if (_color) {
            _color = _color.includes('#') ? _color.replace('#', '') : rgbStringToHex(_color, { withHash: false })
          }
          let fontSizeMatch = _style.match(/font-size\s*:\s*(\d+)px/);
          let fontSize = fontSizeMatch ? parseInt(fontSizeMatch[1]) : _fontSize;
          // console.log(':::::::::::::>>> SUB CHILD', child.type, child.name, $(child).text(), color || _color);
          if (child.type === "text") {
            // runs.push(new docx.TextRun(child.data));
            runs.push(new docx.TextRun({ text: child.data, color: color || _color, bold: bold, size: (fontSize * 1.85) }));
          } else if (child.name === "b" || child.name === "strong") {
            // runs.push(new docx.TextRun({ text: $(child).text(), bold: true }));
            runs.push(new docx.TextRun({ text: $(child).text(), color: color || _color, bold: true, size: (fontSize * 1.85) }));
          } else if (child.name === "i" /*|| child.name === "em"*/) {
            // runs.push(new docx.TextRun({ text: $(child).text(), italics: true }));
            runs.push(new docx.TextRun({ text: $(child).text(), italics: true, color: color || _color, bold: bold || _bold, size: (fontSize * 1.85) }));
          } else if (child.name === "u") {
            // runs.push(new docx.TextRun({ text: $(child).text(), underline: {} }));
            runs.push(new docx.TextRun({ text: $(child).text(), underline: {}, color: color || _color, bold: bold || _bold, size: (fontSize * 1.85) }));
          } else if (child.name === "span" /*|| child.name === "em"*/) {
            runs.push(new docx.TextRun({ text: $(child).text(), color: color || _color, bold: bold || _bold, size: (fontSize * 1.85) }));
          } else if ($(child).text().trim().length > 0) {
            // runs.push(new docx.TextRun($(child).text())); 
            runs.push(new docx.TextRun({ text: $(child).text(), color: color || _color, bold: bold || _bold, size: (fontSize * 1.85) }));
          }
          if($(child).find("br").length) {
            runs.push(new docx.TextRun({ text: "", break: 1 }));
            breakLines++;
          }
        });
    }
    return new docx.Paragraph({
      children: breakLines === runs.length ? [] : runs,
      alignment,
      spacing: {
        before: isLabel ? 50 : 0, 
        after: isLabel ? 200 : 150, 
      },
    });
  }

  function recorrerNodo(node, path = '') {
    $(node).contents().each((i, el) => {
      const currentPath = path + (el.name ? `<${el.name}>` : '[text]');
      const tags = ['div', 'p', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
      const elChildren = $(el).children().toArray();

      const isParseable = elChildren.length ? elChildren.some((child) => {
        return tags.includes(child.name);
      }) : false;
      // console.log('\t\t\n>>> EL: ', {type: el.type, name: el.name, isParseable, html:$(el).html(), text: $(el).text(), currentPath, path});
      if (
        (
          el.type === 'tag'
          && tags.includes(el.name)
          && !isParseable
        ) || (
          el.type === 'text'
          && $(el).text().trim().length
        )
      ) {
        const _paragraph = parseParagraph(el)
        if (_paragraph) children.push(_paragraph);
      } else {
        recorrerNodo(el, currentPath);
      }
    });
  }

  recorrerNodo($.root());
}
// async function loadImageAsUint8ClampedArray(imageBuffer) {
//   // Cargar la imagen desde el buffer
//   const image = await loadImage(imageBuffer);

//   // Crear un canvas con el tamaño de la imagen
//   const canvas = createCanvas(image.width, image.height);
//   const ctx = canvas.getContext("2d");

//   // Dibujar la imagen en el canvas
//   ctx.drawImage(image, 0, 0);

//   // Obtener los datos de píxeles (RGBA)
//   const imageData = ctx.getImageData(0, 0, image.width, image.height);

//   return imageData;
// }
async function loadImageAsUint8ClampedArray(imageBuffer) {
  const image = await loadImage(imageBuffer);
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);

  // 250x250 píxeles desde la esquina superior derecha
  const qrWidth = 750;
  const qrHeight = 750;
  const xStart = image.width - qrWidth; // esquina derecha
  const yStart = 0; // parte superior

  // Extraer solo esa región
  const headerData = ctx.getImageData(xStart, yStart, qrWidth, qrHeight);

  return {
    data: headerData.data,
    width: qrWidth,
    height: qrHeight,
  };
}

if (process.platform === 'win32') {
  wkhtmltopdf.command = 'C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe';
} else {
  wkhtmltopdf.command = 'wkhtmltopdf';
}

module.exports = function documentoService (repositories, helpers, res) {
  const {
    DocumentoRepository,
    DocumentoViaRepository,
    DerivacionRepository,
    UsuarioRepository,
    FormularioRepository,
    FlujoDocumentalRepository,
    FlujoDerivacionRepository,
    ReferenciaDocumentoRepository,
    ArchivoAdjuntoRepository,
    DocumentoCompartidoRepository,
    DocumentoObservacionRepository,
    AprobacionDocumentosRepository,
    BitacoraRepository,
    PermisoRepository,
    transaction
  } = repositories;
  const { CargoRepository } = repositories.planificacion;
  const { PdfMergeHelper, FechaHelper } = helpers;

  const {
    iniciarProcesoAprobacion
  } = require('../system/AprobacionDocumentosService')(repositories, helpers, res);

  const { ejecutarInteroperabilidades } = require('../bpm/ComponenteService')(repositories, helpers, res);

  const { verificarPermisos } = require('../system/AuthService')(repositories, helpers, res);

  function nombreCompleto (usuario) {
    if (usuario) {
      return `${usuario.nombres} ${usuario.primerApellido} ${usuario.segundoApellido}`;
    }
    return '';
  }

  async function findAll (params) {
    try {
      const documentos = await DocumentoRepository.findAll(params);
      return documentos;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function createOrUpdate (data, crearDerivacionInicial = true, t) {
    let transaccion;
    try {
      transaccion = t || await transaction.create();
      const idUsuario = data.userCreated || data.userUpdated;
      data.asunto = data.asunto || data.plantilla.nombre;
      if (data.fechaDocumento) data.fechaDocumento = FechaHelper.formatearFecha(data.fechaDocumento);
      
      
      const usuariosDerivaciones = data.configuracionDerivaciones?.filter(i => i.tipo === 'REMITENTE')?.map(i => i.idUsuario) ?? [];
      let existePermisosFlujo = null;

      if (usuariosDerivaciones.length > 0) {
        const existePermisosDocumento = await verificarPermisos({ usuarios: usuariosDerivaciones, permisos: ['documento:generar:confidencial'] });
        existePermisosFlujo = await verificarPermisos({ usuarios: usuariosDerivaciones, permisos: ['flujo:generar:confidencial'] });
        if (existePermisosDocumento) {
          data.docconfidencial = true;
        }
      }

      const documento = await DocumentoRepository.createOrUpdate(data, transaccion);

      if (documento.idFlujo) {
        const datosFlujo = { id: documento.idFlujo, referencia: documento.asunto }
        if (existePermisosFlujo && documento.estado === 'BORRADOR') {
          datosFlujo.clasificacion = 'CONFIDENCIAL';
        }
        await FlujoDocumentalRepository.createOrUpdate(datosFlujo);
      }

      let derivacion;
      if (crearDerivacionInicial) {
        const cargo = await CargoRepository.findOne({ id: data.idCargo });

        if (!cargo) throw new Error('El cargo no existe');

        const usuario = await UsuarioRepository.findOne({ id: idUsuario });

        derivacion = await FlujoDerivacionRepository.createOrUpdate({
          userCreated           : idUsuario,
          idDocumento           : documento.id,
          idUsuarioRemitente    : null,
          idUsuarioDestinatario : usuario.id,
          nombreDestinatario    : nombreCompleto(usuario),
          fechaRecepcion        : new Date(),
          idCargoDestinatario   : cargo.id,
          cargoDestinatario     : cargo.descripcion,
          estadoActual          : 'ACTIVO'
        }, transaccion);
      }

      if (data.id) await ejecutarInteroperabilidades(documento.id, 'ejecutarGuardar', idUsuario, transaccion);

      if (!t) await transaction.commit(transaccion);

      documento.idDerivacion = derivacion?.id;

      return documento;
    } catch (error) {
      console.error(error);
      if (!t) await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function listar (params) {
    if (params.remitidoPor) {
      try {
        const usuarioRemitente = await UsuarioRepository.findOne({ numeroDocumento: params.remitidoPor });
        params.remitidoPor = usuarioRemitente.id;
      } catch (err) {
        throw new ErrorApp(`No se encuentra usuario con CI: ${params.remitidoPor}`, 404);
      }
    }
    try {
      // const documentos = await DocumentoRepository.findAll({ ...renameKeys(params, { remitidoPor: 'remitenteDe' }) });
      const documentos = await DocumentoRepository.findAll(params);
      return documentos;
      // return documentos.rows.map(d => {
      //   return documentoReducido(d);
      // });
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function listarpor (params) {
    try {
      const documento = await DocumentoRepository.findOne(params);
      if (!documento) {
        throw new Error('El documento no existe');
      }
      return documento;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function despachar (data) {
    let documento;
    try { documento = await DocumentoRepository.findOne({ correlativo: data.correlativo }); } catch (err) {
      throw new ErrorApp(`No se encontró documento con correlativo: ${data.correlativo}`, 404);
    }
    if (documento.destintarioEspecifico && data.usuario.idUsuario !== documento.destintarioEspecifico) {
      throw new ErrorApp(`El usuaTrio ${data.usuario.usuario} no puede aceptar este documento`, 401);
    }
    if (!['BORRADOR', 'PENDIENTE FIRMA'].includes(documento.estado)) {
      throw new ErrorApp('El documento debe estar en estados "BORRADOR" para ser despachado', 400);
    }

    let codigoFlujo = null;
    if (documento.clasificacion !== 'SOLO PARA REFERENCIAR') {
      codigoFlujo = documento.flujoDocumental.codigoFlujo;
    }

    return {
      citeDocumento: documento.cite,
      codigoFlujo
    };
  }

  async function aceptar (data) {
    let documento;
    try { documento = await DocumentoRepository.findOne({ cite: data.cite }); } catch (err) {
      throw new ErrorApp(`No se encontró documento con CITE: ${data.cite}`, 404);
    }

    if (documento.destinatarioEspecifico && data.usuario.idUsuario !== documento.destinatarioEspecifico) {
      throw new ErrorApp(`El usuario ${data.usuario.usuario} no puede aceptar este documento`, 401);
    }

    let _usuario;
    try {
      _usuario = await UsuarioRepository.findOne({ id: data.usuario.idUsuario });
    } catch (err) {
      throw new ErrorApp(err.message, 404);
    }

    if (documento.destintarioArea &&
        _usuario.areas.map(area => { return area.nombreArea; }).indexOf(documento.destintarioArea) === -1) {
      throw new ErrorApp(`El usuario ${data.usuario.usuario} no puede aceptar este documento`, 401);
    }

    if (['NUEVO', 'DERIVADO', 'EN REVISIÓN'].indexOf(documento.estado) === -1) {
      throw new ErrorApp('El documento debe estar en estados "NUEVO" o "DERIVADO" para ser aceptado', 400);
    }

    try {
      const observaciones = documento.observaciones ? [...documento.observaciones] : [];
      observaciones.push({
        tipo  : 'observación',
        autor : {
          nombres         : _usuario.nombres,
          primerApellido  : _usuario.primerApellido,
          segundoApellido : _usuario.segundoApellido,
          numeroDocumento : _usuario.numeroDocumento
        },
        numeroDocumento : _usuario.numeroDocumento,
        fecha           : moment().format('YYYY-MM-DDTHH:mm:ss.SSS'),
        observacion     : data.observacion
      });
    } catch (err) {
      throw new ErrorApp('Error aceptando documento', 500);
    }

    return {
      citeDocumento : documento.cite,
      codigoFlujo   : documento.flujoDocumental.codigoFlujo
    };
  }

  async function observar (data) {
    debug('observando documento');
    let documento;
    try {
      documento = await DocumentoRepository.findOne({ cite: data.cite });
      if (!documento) throw new ErrorApp(`No se encontró documento con CITE: ${data.cite}`, 404);
    } catch (err) {
      throw new ErrorApp(`No se encontró documento con CITE: ${data.cite}`, 404);
    }
    if (documento.clasificacion === 'SOLO PARA REFERENCIAR') { throw new ErrorApp('No se puede observar este documento', 400); }

    if (!documento.destinatarioEspecifico) { throw new ErrorApp('El documento no esta dirigido a un usuario en específico'); }
    if (documento.destinatarioEspecifico && data.usuario.idUsuario !== documento.destinatarioEspecifico) {
      throw new ErrorApp(`El usuario ${data.usuario.usuario} no puede observar este documento`, 401);
    }

    let _usuario;
    try {
      _usuario = await UsuarioRepository.findOne({ id: data.usuario.idUsuario });
    } catch (err) {
      throw new ErrorApp(err.message, 404);
    }

    if (['NUEVO', 'DERIVADO'].indexOf(documento.estado) === -1) {
      throw new ErrorApp('El documento debe estar en estados "NUEVO" o "DERIVADO" para ser observado', 400);
    }

    try {
      const observaciones = documento.observaciones ? [...documento.observaciones] : [];
      observaciones.push({
        tipo  : 'observación',
        autor : {
          nombres         : _usuario.nombres,
          primerApellido  : _usuario.primerApellido,
          segundoApellido : _usuario.segundoApellido,
          numeroDocumento : _usuario.numeroDocumento
        },
        numeroDocumento : _usuario.numeroDocumento,
        fecha           : moment().format('YYYY-MM-DDTHH:mm:ss.SSS'),
        observacion     : data.observacion
      });
    } catch (err) {
      throw new ErrorApp('Error observando documento', 500);
    }

    return {
      citeDocumento : documento.cite,
      codigoFlujo   : documento.flujoDocumental.codigoFlujo
    };
  }

  async function observarFlujoFisico (data) {
    debug('observando documento fisico');
    let documento;
    let transaccion;
    try {
      documento = await DocumentoRepository.findOne({ cite: data.cite, id: data.idDocumento });
      if (!documento) throw new ErrorApp(`No se encontró documento con CITE: ${data.cite}`, 404);
    } catch (err) {
      throw new ErrorApp(`No se encontró documento con CITE: ${data.cite}`, 404);
    }
    if (documento.clasificacion === 'SOLO PARA REFERENCIAR') { throw new ErrorApp('No se puede observar este documento', 400); }

    let usuarioActual = usuarioDocumento = null;
    try {
      usuarioActual = await UsuarioRepository.findOne({ id: data.usuario.idUsuario });
      usuarioDocumento = await UsuarioRepository.findOne({ id: documento.userCreated });
    } catch (err) {
      throw new ErrorApp(err.message, 404);
    }
    const derivacionActual = await FlujoDerivacionRepository.findOne({
      idFlujo: documento.flujoDocumental.id
    });
    // const derivacionObservacion = await FlujoDerivacionRepository.findOne({
    //   idFlujo: documento.flujoDocumental.id,
    //   idDocumento: documento.id,
    //   idUsuarioDestinatario: documento.userCreated,
    //   estadoActual: 'INACTIVO',
    //   order: 'ASC'
    // });
    try {
      transaccion = await transaction.create();

      await DocumentoRepository.createOrUpdate({
        id          : documento.id,
        editable    : true,
        estado      : 'EN CORRECCION',
        userUpdated : usuarioActual.id
      }, transaccion);

      await DocumentoObservacionRepository.createOrUpdate({
        idDocumento        : documento.id,
        idUsuarioRevisor   : usuarioActual.id,
        idUsuarioObservado : usuarioDocumento.id,
        idDerivacionOrigen : derivacionActual.id,
        plantillaObservada : documento.plantillaValor,
        observacion        : data.observacion,
        fechaObservacion   : new Date(),
        userCreated        : usuarioActual.id
      }, transaccion);

      await transaction.commit(transaccion);

      return {
        citeDocumento : documento.cite,
        hojaRuta      : documento.flujoDocumental.codigoFlujo
      };
    } catch (error) {
      debug('ERRORRRRR!!! ', error);
      await transaction.rollback(transaccion);
      console.error(error);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function correccionFlujoFisico (data) {
    let transaccion;
    let documento;
    try {
      documento = await DocumentoRepository.findOne({ cite: data.cite, id: data.idDocumento });
      if (!documento) throw new ErrorApp(`No se encontró documento con CITE: ${data.cite}`, 404);
    } catch (err) {
      throw new ErrorApp(`No se encontró documento con CITE: ${data.cite}`, 404);
    }

    let usuarioActual = null;
    try {
      usuarioActual = await UsuarioRepository.findOne({ id: data.usuario.idUsuario });
    } catch (err) {
      throw new ErrorApp(err.message, 404);
    }
    try {
      transaccion = await transaction.create();
      for (let index = 0; index < data.items.length; index++) {
        await DocumentoObservacionRepository.createOrUpdate({
          id              : data.items[index],
          corregido       : true,
          fechaCorreccion : new Date(),
          userUpdated     : usuarioActual.id
        }, transaccion);
      }

      await DocumentoRepository.createOrUpdate({
        id          : documento.id,
        editable    : false,
        estado      : 'CERRADO',
        userUpdated : usuarioActual.id
      }, transaccion);

      await transaction.commit(transaccion);

      return {
        citeDocumento : documento.cite,
        hojaRuta      : documento.flujoDocumental.codigoFlujo
      };
    } catch (error) {
      debug('ERRORRRRR!!! ', error);
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }
  async function getObservacionFlujoFisico (data) {
    try {
      const documento = await DocumentoRepository.findOne({ id: data.idDocumento });
      if (!documento) throw new ErrorApp('No se encontró documento', 404);
      const observacion = await DocumentoObservacionRepository.findOne({ idDocumento: documento.id, corregido: false });
      if (!observacion) throw new ErrorApp(`No se encontró ninguna observación pendiente al documento con CITE: ${documento.cite}`, 404);
      observacion.usuario = await UsuarioRepository.findOne({ id: observacion.idUsuarioRevisor });
      return observacion;
    } catch (err) {
      throw new ErrorApp(err.message, 404);
    }
  }

  async function subsanarObservacion (data) {
    debug('subsnando observación de documento');
    let documento;
    try {
      documento = await DocumentoRepository.findOne({ cite: data.cite });
      if (!documento) throw new ErrorApp(`No se encontró documento con CITE: ${data.cite}`, 404);
    } catch (err) {
      throw new ErrorApp(`No se encontró documento con CITE: ${data.cite}`, 404);
    }
    if (documento.clasificacion === 'SOLO PARA REFERENCIAR') { throw new ErrorApp('No se puede subsanar observaciones de este documento', 400); }

    if (data.usuario.idUsuario !== documento.remitenteDe) {
      throw new ErrorApp(`El usuario ${data.usuario.usuario} no puede subsanar este documento`, 401);
    }

    let _usuario;
    try {
      _usuario = await UsuarioRepository.findOne({ id: data.usuario.idUsuario });
    } catch (err) {
      throw new ErrorApp(err.message, 404);
    }

    if (['REQUIERE RESPUESTA'].indexOf(documento.estado) === -1) {
      throw new ErrorApp('El documento debe estar en estados "REQUIERE RESPUESTA" para ser subsanado', 400);
    }

    try {
      const observaciones = documento.observaciones ? [...documento.observaciones] : [];
      observaciones.push({
        tipo            : 'subsanación',
        numeroDocumento : _usuario.numeroDocumento,
        autor           : {
          nombres         : _usuario.nombres,
          primerApellido  : _usuario.primerApellido,
          segundoApellido : _usuario.segundoApellido,
          numeroDocumento : _usuario.numeroDocumento
        },
        fecha       : moment().format('YYYY-MM-DDTHH:mm:ss.SSS'),
        observacion : data.comentario
      });
    } catch (err) {
      throw new ErrorApp('Error subsanando observación de documento', 500);
    }

    return {
      citeDocumento : documento.cite,
      codigoFlujo   : documento.flujoDocumental.codigoFlujo
    };
  }

  async function vistoBuenoCreacion (data) {
    let documento;
    try { documento = await DocumentoRepository.findOne({ cite: data.cite }); } catch (err) {
      throw new ErrorApp(`No se encontró documento con CITE: ${data.cite}`, 404);
    }
    if (documento.clasificacion === 'SOLO PARA REFERENCIAR') { throw new ErrorApp('No se puede dar visto bueno a este documento', 400); }

    let viaEncontrado;
    try {
      viaEncontrado = await DocumentoViaRepository.findOne({
        idDocumento : documento.id,
        idUsuario   : data.usuario.idUsuario
      });
      if (!viaEncontrado) throw new Error('No se ha encontrado via', 404);
    } catch (err) {
      throw new ErrorApp(`Error buscando vía de creación de documento con CITE: ${data.cite}`, 404);
    }

    let _usuario;
    try {
      _usuario = await UsuarioRepository.findOne({ id: data.usuario.idUsuario });
    } catch (err) {
      throw new ErrorApp(err.message, 404);
    }

    if (viaEncontrado && viaEncontrado.vistoBueno) { throw new ErrorApp('Este documento ya tiene visto bueno de este usuario'); }

    try {
      const observaciones = documento.observaciones ? [...documento.observaciones] : [];
      observaciones.push({
        tipo  : 'visto bueno',
        autor : {
          nombres         : _usuario.nombres,
          primerApellido  : _usuario.primerApellido,
          segundoApellido : _usuario.segundoApellido,
          numeroDocumento : _usuario.numeroDocumento
        },
        numeroDocumento : _usuario.numeroDocumento,
        fecha           : moment().format('YYYY-MM-DDTHH:mm:ss.SSS'),
        observacion     : data.observacion
      });
    } catch (err) {
      throw new ErrorApp(`Error actualizando vía de creación de documento con CITE: ${data.cite}`, 500);
    }

    return {
      cite        : documento.cite,
      codigoFlujo : documento.flujoDocumental.codigoFlujo
    };
  }

  async function vistoBuenoDerivacion (data) {
    let documento;
    try { documento = await DocumentoRepository.findOne({ cite: data.cite }); } catch (err) {
      throw new ErrorApp(`No se encontró documento con CITE: ${data.cite}`, 404);
    }
    if (documento.clasificacion === 'SOLO PARA REFERENCIAR') { throw new ErrorApp('No se puede dar visto bueno a este documento', 400); }

    try {
      const derivacionesVia = await DerivacionRepository
        .derivacionesViaIncompletas(documento.id, data.usuario.idUsuario);
      if (derivacionesVia.count === 0) { throw new Error('No tiene derivaciones vía incompletas'); }
    } catch (err) {
      throw new ErrorApp('No se encontraron derivaciones vía incompletas', 404);
    }

    try {
      const observaciones = documento.observaciones ? [...documento.observaciones] : [];

      await DocumentoRepository.update({
        id          : documento.id,
        observaciones,
        userUpdated : data.userCreated || data.userUpdated
      });
    } catch (err) {
      throw new ErrorApp('Error actualizando documento', 500);
    }

    return {
      cite        : documento.cite,
      codigoFlujo : documento.flujoDocumental.codigoFlujo
    };
  }

  async function solicitudCerrar (data) {
    let documento, _usuario, respuestaAprobacion;
    respuestaAprobacion = { linkRedireccion: null };
    try {
      documento = await DocumentoRepository.findOne({ cite: data.cite });
      if (!documento) throw new ErrorApp(`No se encontró documento con CITE: ${data.cite}`, 404);
    } catch (err) {
      throw new ErrorApp(`No se encontró documento con CITE: ${data.cite}`, 404);
    }

    if (documento.clasificacion === 'SOLO PARA REFERENCIAR') { throw new ErrorApp('No se puede cerrar a este documento', 400); }

    if (documento.destinatarioEspecifico && data.usuario.idUsuario !== documento.destinatarioEspecifico) {
      throw new ErrorApp(`El usuario ${data.usuario.usuario} no puede cerrar este documento`, 401);
    }

    try {
      _usuario = await UsuarioRepository.findOne({ id: data.usuario.idUsuario });
    } catch (err) {
      throw new ErrorApp(err.message, 404);
    }

    if (documento.destintarioArea &&
        _usuario.areas.map(area => { return area.nombreArea; }).indexOf(documento.destintarioArea) === -1) {
      throw new ErrorApp(`El usuario ${data.usuario.usuario} no puede cerrar este documento`, 401);
    }

    if (['NUEVO', 'DERIVADO', 'EN REVISIÓN', 'PROCESADO', 'DESPACHADO'].indexOf(documento.estado) === -1) {
      throw new ErrorApp(
        ` El documento debe estar en estados NUEVO, DERIVADO, EN REVISIÓN, PROCESADO
        o DESPACHADO  para ser cerrado`, 400);
    }

    try {
      respuestaAprobacion = await aprobacionCiudadania(documento, _usuario);
    } catch (err) {
      throw new ErrorApp(err.message, 500);
    }

    try {
      const observaciones = documento.observaciones ? [...documento.observaciones] : [];
      observaciones.push({
        tipo            : 'cierre',
        numeroDocumento : _usuario.numeroDocumento,
        fecha           : moment().format('YYYY-MM-DDTHH:mm:ss.SSS'),
        observacion     : data.descripcion
      });
    } catch (err) {
      throw new ErrorApp('Error cerrando documento', 500);
    }

    return {
      citeDocumento   : documento.cite,
      codigoFlujo     : documento.flujoDocumental.codigoFlujo,
      linkRedireccion : respuestaAprobacion.linkRedireccion
    };
  }

  async function solicitudArchivar (data) {
    let documento;
    let respuestaAprobacion = { linkRedireccion: null };
    try {
      documento = await DocumentoRepository.findOne({ cite: data.cite });
      if (!documento) throw new ErrorApp(`No se encontró documento con CITE: ${data.cite}`, 404);
    } catch (err) {
      throw new ErrorApp(`No se encontró documento con CITE: ${data.cite}`, 404);
    }

    if (documento.destinatarioEspecifico && data.usuario.idUsuario !== documento.destinatarioEspecifico) {
      throw new ErrorApp(`El usuario ${data.usuario.usuario} no puede archivar este documento`, 401);
    }

    let _usuario;
    try {
      _usuario = await UsuarioRepository.findOne({ id: data.usuario.idUsuario });
    } catch (err) {
      throw new ErrorApp(err.message, 404);
    }

    if (documento.destintarioArea &&
        _usuario.areas.map(area => { return area.nombreArea; }).indexOf(documento.destintarioArea) === -1) {
      throw new ErrorApp(`El usuario ${data.usuario.usuario} no puede archivar este documento`, 401);
    }

    if (!['NUEVO', 'DERIVADO', 'EN REVISIÓN', 'PROCESADO', 'DESPACHADO'].includes(documento.estado)) {
      throw new ErrorApp(
        ` El documento debe estar en estados NUEVO, DERIVADO, EN REVISIÓN, PROCESADO
        o DESPACHADO  para ser archivado`, 400);
    }

    /*
      TODO: Solo se debería archivar el documento si este ha sido aprobado por ciudadanía digital
      con fines demostrativos se mantiene el cierre luego del primer paso de aprobación.

      Aquí se debería verificar si el documento esta firmado
    */

    try {
      respuestaAprobacion = await aprobacionCiudadania(documento, _usuario, '', data.urlRedireccionCliente, 'ARCHIVAR');
    } catch (err) {
      throw new ErrorApp(err.message, 500);
    }

    try {
      const observaciones = documento.observaciones ? [...documento.observaciones] : [];
      observaciones.push({
        tipo            : 'archivado',
        numeroDocumento : _usuario.numeroDocumento,
        fecha           : moment().format('YYYY-MM-DDTHH:mm:ss.SSS'),
        observacion     : data.descripcion
      });
      /* updated = await DocumentoRepository.update({
        id           : documento.id,
        estado       : 'ARCHIVADO',
        observaciones,
        fechaCerrado : moment().format('YYYY-MM-DDTHH:mm:ss.SSS'),
        userUpdated  : data.userCreated || data.userUpdated
      });
      */
    } catch (err) {
      throw new ErrorApp('Error archivando documento', 500);
    }

    return {
      citeDocumento   : documento.cite,
      codigoFlujo     : documento.flujoDocumental.codigoFlujo,
      linkRedireccion : respuestaAprobacion.linkRedireccion
    };
  }

  /* async function archivar (data) {
    const updated = await DocumentoRepository.update({
      id           : data.id,
      estado       : 'ARCHIVADO',
      fechaCerrado : moment().format('YYYY-MM-DDTHH:mm:ss.SSS'),
      userUpdated  : data.userCreated || data.userUpdated
    });
    return updated;
  } */

  async function esVisibleParaUsuario (documento, idUsuario) {
    const esVisible = await DocumentoRepository.esVisibleParaUsuario(documento, idUsuario);
    return esVisible;
  }

  async function deleteItem (params) {
    let transaccion;
    try {
      transaccion = await transaction.create();
      await DocumentoRepository.deleteItemCond(params);
      await FlujoDerivacionRepository.deleteItemCond({ idDocumento: params.id });
      await transaction.commit(transaccion);
      return true;
    } catch (error) {
      debug('ERRORRRRR!!! ', error);
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function getFormulariosComponentes (componentes) {
    const idComponentes = componentes.map(x => x.id);
    const { rows } = await FormularioRepository.findByComponentes(idComponentes);
    return rows;
  }

  async function createPdf (html, pdfOptions = {}, header, footer) {

      console.log("============== DEBUG PDF ==============");
      console.log("HEADER URL:", header);
      console.log("FOOTER URL:", footer); 
      console.log("OUTPUT:", pdfOptions.output)

    const opt = {
      dpi           : 72,
  "header-html": header,
  "footer-html": footer,

  "header-spacing": 5,
  "footer-spacing": 2,
      // pageSize      : pdfOptions.pageSize     || 'letter',
      marginLeft    : pdfOptions.marginLeft   || '4cm',
      marginRight   : pdfOptions.marginRight  || '3cm',
      marginTop     : pdfOptions.marginTop    || '6cm',
      marginBottom  : pdfOptions.marginBottom || '4cm',
      output        : pdfOptions.output       || '/tmp/documento.pdf'
      // footerFontSize : 8,
      // footerRight    : '[page] de [toPage]',
      // footerLeft     : `Este documento puede ser verificado en ${config.app.FRONTEND_VERIFICAR} &nbsp; asasdasdasdasdasd`
    };
    if (!pdfOptions.pageSize) {
      opt.pageSize = 'letter';
    } else {
      if (pdfOptions.pageSize instanceof Object) {
        opt.pageWidth = pdfOptions.pageSize.width;
        opt.pageHeight = pdfOptions.pageSize.height;
        opt.marginTop = '0mm';
        opt.marginBottom = '0mm';
      } else {
        opt.pageSize = pdfOptions.pageSize;
      }
    }

    return new Promise((resolve, reject) => {
      wkhtmltopdf(html, opt, (err) => {
        if (err) { return reject(err); }
        resolve();
      });
    });
  }

  async function vistaFile (file) {
    const { fileStoragePath } = config.app;
    try {
      const contentType = mime.lookup(file);
      if (contentType) {
        const locationFile = `/documentos/uploads/${file}`;
        const outPath = path.resolve(`${fileStoragePath}${locationFile}`);
        const respuesta = fs.readFileSync(outPath);
        return { contentType, respuesta };
      } else {
        return {};
      }
    } catch (error) {
      return {};
    }
  }

  function existPathPDF (id) {
    const { fileStoragePath } = config.app;
    const folder = `${fileStoragePath}/documentos/generados/pdf`;
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }
    const locationFile = `/documentos/generados/pdf/${id}.pdf`;
    const outPath = path.resolve(`${fileStoragePath}${locationFile}`);
    return fs.existsSync(outPath);
  }

  function calcularVisibleDerivacion (configuracion, tipo, tipoConfig, totalValores) {
    if (configuracion[tipoConfig]?.multiple && configuracion[tipoConfig]?.visible) return totalValores.valores[tipo]?.some(x => x?.visiblePdf === true);

    if (!configuracion[tipoConfig]?.multiple && configuracion[tipoConfig]?.visible) return totalValores.valores[tipo]?.visiblePdf;
  }

  async function generarPlantillaWord (id, leer = true, idUsuario, reload = false) {
    const { rootPath, fileStoragePath, deletePath } = config.app;
    let locationFile = `/documentos/generados/plantilla`;
    let outputDir = path.resolve(`${fileStoragePath}${locationFile}`);
    
    try {
      // if (!fs.existsSync(`${fileStoragePath}/documentos/temporales/${id}.json`)) {
      //   const _documento = await findOne({ id });
      //   fs.writeFileSync(`${fileStoragePath}/documentos/temporales/${id}.json`, JSON.stringify(_documento));
      // }
      // const contenidoDocumento = fs.readFileSync(`${fileStoragePath}/documentos/temporales/${id}.json`);
      const documento = await findOne({ id });

      for (const componente of documento?.plantilla?.configuracion_json) {
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

      if (documento?.plantillaValor?.length === 0) throw new Error('No se pudo crear la plantilla, por favor revise si el formulario contiene información');
      
      const referencias = await ReferenciaDocumentoRepository.findAll({ idDocumento: id });
      let adjuntos = [];
      if (!documento?.plantilla?.ocultarAdjunto) {
        adjuntos = await ArchivoAdjuntoRepository.findAll({ idDocumento: id });
      }
      if (referencias.count > 0) {
        referencias.rows = referencias.rows.map(item => item?.documentoReferenciado?.cite).join(', ');
      }

      /* =========================== ShortCodes =========================== */
      const shortCodes = {};
        // ------------------------------------- nombreRemitente-----------------------------------------
      const usuarioRemitenteDoc = await UsuarioRepository.findOne({ id: documento.remitenteDe });
      const usuarioRemitente = documento.configuracionDerivaciones.find(d => d.inicial && d.tipo === 'REMITENTE')
      const cargo = usuarioRemitente ? await CargoRepository.findOne({ id: usuarioRemitente.idCargo }) : null;      
      shortCodes['{{_cargoCiudad_}}'] = cargo?.ciudad || null;
        // ------------------------------------- fechaDocumento-----------------------------------------
      const fechaDocumento = documento?.cite ? documento.fechaDocumento.split('-').reverse().join('-') : ((new Date()).toISOString().split('T')[0]);
      if (documento.plantilla.fechaLiteralPdf) {
        shortCodes['{{_fechaDocumento_}}'] = formatoFechaLiteral(fechaDocumento);
      } else {
        shortCodes['{{_fechaDocumento_}}'] = fechaDocumento;
      }
        // ------------------------------------- citeDocumento-----------------------------------------
      shortCodes['{{_citeDocumento_}}'] = documento.cite ?? null;
      /* =========================== End ShortCodes =========================== */

      /**
       * Generar WORD with DOCX library
      */
      const pageSize = {
        A4: { width: 11906, height: 16838 },
        LETTER: { width: 12240, height: 15840 },
        OFFICE: { width: 12240, height: 18720 },
        LEGAL: { width: 12240, height: 20160 }
      }

      const configuracionPagina = documento?.plantilla?.configuracionPagina;
      let configuracionPageSize = 'LETTER';
      if (configuracionPagina?.tamanioPagina === 'A4') configuracionPageSize = 'A4';
      if (configuracionPagina?.tamanioPagina === 'OFICIO') configuracionPageSize = 'OFFICE';
      if (configuracionPagina?.tamanioPagina === 'LEGAL') configuracionPageSize = 'LEGAL';

      const outputDir = path.resolve(`${fileStoragePath}/documentos/generados/word`);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const configuracionJson = JSON.parse(JSON.stringify(documento.plantilla?.configuracion_json));
      
      const runs = [];

      const derivacion = documento?.plantilla?.configuracion_json?.find(x => x?.type === 'derivacion')
      let renderTitle = false;

      if (!derivacion?.ocultarEnPdf) {
        renderTitle = true;
        // runs.push(
        //   new docx.Paragraph({
        //     alignment: docx.AlignmentType.CENTER,
        //     spacing: {
        //       after: 200,  // margen inferior
        //     },
        //     children: [new docx.TextRun({ 
        //       text: documento.plantilla.nombre.toUpperCase(), 
        //       // bold: true, 
        //       size: 30
        //     })],
        //   })
        // )
      }
      // Generar el codigo QR unico para el documento
      const qrBase64 = await QRCode.toDataURL(`Documento-${documento.id}`);
      const base64Data = qrBase64.split(",")[1];

      const docxOptions = {
        styles: {
          default: {
            document: {
              run: {
                // font: "Verdana",   // Tipo de letra por defecto
                font: "Arial",   // Tipo de letra por defecto
                // font: "Poppins",   // Tipo de letra por defecto
                size: 22,          // Tamaño 24 → equivale a 12 pt (cada punto = 2)
                color: "000000",   // Negro
              },
              paragraph: {
                spacing: { line: 276 }, // Espaciado (276 = 1.15)
              },
            },
          },
        },
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: parseFloat(configuracionPagina?.margenSuperior || 3) * 567,
                  right: parseFloat(configuracionPagina?.margenDerecho || 3) * 567,
                  bottom: parseFloat(configuracionPagina?.margenInferior || 3) * 567,
                  left: parseFloat(configuracionPagina?.margenIzquierdo || 3) * 567
                },
                size: {
                  orientation: docx.PageOrientation.PORTRAIT,
                  width: pageSize[configuracionPageSize].width,
                  height: pageSize[configuracionPageSize].height
                },
              },
            },
            headers: {
              default: new docx.Header({
                children: [
                  new docx.Paragraph({
                      children: [
                        new docx.TextRun({
                          text: "Identificador: ",
                          bold: true, 
                          size: 20
                        }),
                        new docx.ImageRun({
                          data: Buffer.from(base64Data, "base64"),
                          transformation: { width: 50, height: 50 },
                        }),
                      ],
                      alignment: docx.AlignmentType.RIGHT
                  }),
                ],
              }),
            },
            children: runs,
          },
        ],
      }
      
      const pageWidth = pageSize[configuracionPageSize].width;
      const pageMarginX = docxOptions.sections[0].properties.page.margin.left + docxOptions.sections[0].properties.page.margin.right;
      const usableWidth = pageWidth - pageMarginX;

      const addLabel = (text, children) => {
        if (text) {
          if (esHTML(text)) {
            getNodosFromHTML(text, children, true);
          } else {
            children.push(
              new docx.Paragraph({
                spacing: {
                  before: 50, // margen superior (en twips)
                  after: 200,  // margen inferior
                },
                children: [new docx.TextRun({ 
                  text: text
                })],
              })
            )
          }
        }
      }

      for (const componente of configuracionJson) {
        switch (componente.type) {
          case 'editor':
            let contenido = componente.value.valores
            if (contenido && shortCodes) {
                for (const key in shortCodes) {
                    contenido = contenido.replaceAll(key, shortCodes[key] ?? '')
                }
            }
            addLabel(componente?.label, runs);
            getNodosFromHTML(contenido, runs);
            break;
          case 'title':
            if (!componente?.hidden) {
              addLabel(componente?.label, runs);
            }
            break;
          default:
            const _document = {
              ...documento,
              plantilla: {
                ...documento.plantilla,
                configuracion_json: [componente]
              }
            }
            const htmlComponent = await ejs.renderFile(path.resolve(`${rootPath}/../../views/documento.ejs`), {
              documento   : _document,
              referencias : referencias,
              adjuntos    : [],
              marginLeft  : (_document?.plantilla?.configuracionPagina?.margenIzquierdo || 4) + 'cm',
              marginRight : (_document?.plantilla?.configuracionPagina?.margenDerecho || 3) + 'cm',
              marginTop    : (_document?.plantilla?.configuracionPagina?.margenSuperior || 3)  + 'cm',
              marginBottom : (_document?.plantilla?.configuracionPagina?.margenInferior || 3) + 'cm',
              shortCodes  : shortCodes,
              docxFormat  : true,
              renderTitle
            });
            fs.writeFileSync(`${outputDir}/${componente.type}-${documento.id}.html`, htmlComponent);
            const bufferImage = await htmlToImage(htmlComponent)
            fs.writeFileSync(`${outputDir}/${componente.type}-${documento.id}.png`, bufferImage);

            const { width, height } = sizeOf(bufferImage);
            
            if (height <= 1) {
              break;
            }

            const porcentaje = usableWidth * 100 / pageWidth;
            const widthTotal = width * porcentaje / 100;
            const heighttotal = height * porcentaje / 100;

            runs.push(
              new docx.Paragraph({
                children: [
                  new docx.ImageRun({
                    data: bufferImage,
                    transformation: {
                      width: widthTotal,
                      height: heighttotal
                    },
                    floating: undefined,
                  }),
                ],
              })
            )
            renderTitle = false
            break;
        }
      }
      const doc = new docx.Document(docxOptions);

      const outputPath = path.join(outputDir, `${id}.docx`);

      await docx.Packer.toBuffer(doc).then((buffer) => {
        fs.writeFileSync(outputPath, buffer);
        console.log(`✅ Documento Word generado: ${outputDir}/${id}.docx`);
      });

      // fs.writeFileSync(`${outputDir}/${id}.docx`, fileBuffer);
      const respuesta = fs.readFileSync(outputPath, 'base64');

      return respuesta;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }


  async function establecerPlantillaPdf(params) {
    const { fileStoragePath } = config.app;
    let transaccion;
    try {
      transaccion = await transaction.create();
      const documento = await DocumentoRepository.createOrUpdate({
        id: params.id,
        plantillaPdf: true,
        userUpdated: params.userUpdated
      }, transaccion);
      const locationFile = `/documentos/generados/plantilla`;
      const outPath = path.resolve(`${fileStoragePath}${locationFile}`);
      if (!fs.existsSync(outPath)) {
        fs.mkdirSync(outPath, { recursive: true });
      }
      const base64 = params.plantilla.replace(/^data:application\/pdf;base64,/, '');
      const buffer = Buffer.from(base64, 'base64');

      // Validar que sea un pdf valido
      const convert = fromBuffer(buffer, {
        density: 300,
        format: "png",
        width: 2550,   // 8.5" * 300 dpi
        height: 3300,  // 11" * 300 dpi
        saveFilename: `tempImage-${params.id}`,
        savePath: outPath,
        preserveAspectRatio: true,
      });
      const result = await convert(1);
      const imageBuffer = fs.readFileSync(result.path);

      // fs.writeFileSync(`debug-${params.id}.png`, imageBuffer);

      const imageData = await loadImageAsUint8ClampedArray(imageBuffer);
      const qrResult = jsQR(imageData.data, imageData.width, imageData.height);
      // console.log("\n::::::::::::::::>>>> Código detectado:", qrResult);
      fs.unlinkSync(result.path);

      const verificado = qrResult ? qrResult.data === `Documento-${documento.id}` : false;

      if (!verificado) {
        throw new Error('El archivo PDF no es válido, por favor verifique que el archivo contenga el código QR generado por el sistema.');
      }

      const plantillaPath = `${outPath}/${documento.id}.pdf`

      fs.writeFileSync(plantillaPath, buffer);
      await transaction.commit(transaccion);
      
    } catch (error) {
      console.error(error);
      await transaction.rollback(transaccion);
      throw new Error(error.message);
    }
  }

  async function generateFromPlantillaPDF(params) {
    const { fileStoragePath } = config.app;
    const { idUsuario, documento, documentoPath } = params;

    const locationFile = `/documentos/generados/plantilla`;
    const outPath = path.resolve(`${fileStoragePath}${locationFile}`);
    const plantillaPath = `${outPath}/${documento.id}.pdf`
    if (!fs.existsSync(plantillaPath)) {
      return false;
    }

    const locationFileTemp = `/documentos/generados/plantilla/temp`;
    const outPathTemp = path.resolve(`${fileStoragePath}${locationFileTemp}`);
    if (!fs.existsSync(outPathTemp)) {
      fs.mkdirSync(outPathTemp, { recursive: true });
    }
    const blankHtmlPath = path.join(outPathTemp, 'blank.html');
    fs.writeFileSync(blankHtmlPath, '<html><body></body></html>');

    const tempHeaderFooterPDF = path.join(outPathTemp, `HeaderFooter-${documento.id}.pdf`);
    const options = {
      pageSize     : documento?.plantilla?.configuracionPagina?.tamanioPagina?.nombre === 'OFICIO' ? 'legal' : 'letter' || 'letter',
      marginLeft   : '0cm',
      marginRight  : '0cm',
      //marginTop    : (documento?.plantilla?.configuracionPagina?.margenSuperior || 3)  + 'cm',
      marginTop: '6cm'
      marginBottom : (documento?.plantilla?.configuracionPagina?.margenInferior || 3) + 'cm',
      output       : tempHeaderFooterPDF
    };
    const headerUrl = `${config.app.BACKEND_URL_LOCAL}/public/generarHeaderPdfDocumento/${documento.id}?idUsuario=${idUsuario}`;
    const footerUrl = `${config.app.BACKEND_URL_LOCAL}/public/generarFooterPdfDocumento?tipo=${documento.plantilla.idCategoria}&id=${documento.id}&idUsuario=${idUsuario}`;
    
    await createPdf('<html><body></body></html>', options, headerUrl, footerUrl);

    const originalBytes = fs.readFileSync(plantillaPath);
    const headerFooterBytes = fs.readFileSync(tempHeaderFooterPDF);

    const originalPdf = await PDFDocument.load(originalBytes);
    const headerFooterPdf = await PDFDocument.load(headerFooterBytes);
    
    const [headerFooterPage] = await originalPdf.copyPages(headerFooterPdf, [0]);

    const pages = originalPdf.getPages();

    const embeddedPage = await originalPdf.embedPage(headerFooterPage);

    pages.forEach((page) => {
      if (page) {
        page.drawPage(embeddedPage, {
          x: 0,
          y: 0,
          width: embeddedPage.width,
          height: embeddedPage.height
        });
      }
    });
    // Guarda el PDF final
    const outputPDFPath = `${outPath}/DOC-${documento.id}.pdf`;
    const modifiedPdfBytes = await originalPdf.save();
    fs.writeFileSync(outputPDFPath, modifiedPdfBytes);
    fs.writeFileSync(documentoPath, modifiedPdfBytes);
    fs.unlinkSync(tempHeaderFooterPDF);
    return true;
  }

  async function generarPdf (id, leer = true, idUsuario, reload = false) {
    const { rootPath, fileStoragePath, deletePath } = config.app;
    const shortCodes = {};
    let locationFile = `/documentos/generados/pdf/${id}.pdf`;
    // obtener el id del documento original en copias
    const idDocumentoOriginal = await DocumentoRepository.getIdOriginal({ id });
    if (idDocumentoOriginal) {
      locationFile = `/documentos/generados/pdf/${idDocumentoOriginal}.pdf`;
      id = idDocumentoOriginal;
    }
    let outPath = path.resolve(`${fileStoragePath}${locationFile}`);
    
    try {
      if (!fs.existsSync(`${fileStoragePath}/documentos/temporales/${id}.json`)) {
        const _documento = await findOne({ id });
        fs.writeFileSync(`${fileStoragePath}/documentos/temporales/${id}.json`, JSON.stringify(_documento));
      }
      const contenidoDocumento = fs.readFileSync(`${fileStoragePath}/documentos/temporales/${id}.json`);
      const documento = JSON.parse(contenidoDocumento);

      if (documento?.plantillaValor?.length === 0) throw new Error('No se pudo crear el PDF, por favor revise si el formulario contiene información');

      // ShortCodes
      const usuarioRemitente = documento.configuracionDerivaciones.find(d => d.inicial && d.tipo === 'REMITENTE')
      const cargo = usuarioRemitente ? await CargoRepository.findOne({ id: usuarioRemitente.idCargo }) : null;      
      shortCodes['{{_cargoCiudad_}}'] = cargo?.ciudad || null;
      // ------------------------------------- fechaDocumento-----------------------------------------
      const fechaDocumento = documento?.cite ? documento.fechaDocumento.split('-').reverse().join('-') : ((new Date()).toISOString().split('T')[0]);
      if (documento.plantilla.fechaLiteralPdf) {
        shortCodes['{{_fechaDocumento_}}'] = formatoFechaLiteral(fechaDocumento);
      } else {
        shortCodes['{{_fechaDocumento_}}'] = fechaDocumento;
      }
      // ------------------------------------- citeDocumento-----------------------------------------
      shortCodes['{{_citeDocumento_}}'] = documento.cite ?? null;
      // END ShortCodes
      
      const referencias = await ReferenciaDocumentoRepository.findAll({ idDocumento: id });
      let adjuntos = [];
      if (!documento?.plantilla?.ocultarAdjunto) {
        adjuntos = await ArchivoAdjuntoRepository.findAll({ idDocumento: id });
      }
      if (referencias.count > 0) {
        referencias.rows = referencias.rows.map(item => item?.documentoReferenciado?.cite).join(', ');
      }

      let edit = false;
      if (!fs.existsSync(outPath) && leer) {
        locationFile = `/documentos/generados/pdf/BORRADOR-${documento.id}.pdf`;
        outPath = path.resolve(`${fileStoragePath}${locationFile}`);
        edit = true;
      }
      if (['CANCELADO', 'INVALIDO', 'OBSERVADO'].includes(documento.estado)) {
        const { fileStoragePath } = config.app;
        const pdfPath = `${fileStoragePath}/documentos/generados/pdf`;
        const fullPath = path.resolve(`${pdfPath}/${documento.id}.pdf`);

        if (fs.existsSync(fullPath)) {
          const folder = `${pdfPath}/observados`;
          if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder);
          }
          if (!fs.existsSync(`${folder}/${documento.id}.pdf`)) {
            await fs.promises.rename(fullPath, `${folder}/${documento.id}.pdf`);
          }
        }
        edit = true;
      }

      if (!fs.existsSync(outPath) || edit || reload) {
        // const membretado = fs.readFileSync(path.resolve(`${rootPath}/../../views/marca_agua_carta_2022.jpeg`), 'base64');
        for (const componente of documento?.plantilla?.configuracion_json) {
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
        const html = await ejs.renderFile(path.resolve(`${rootPath}/../../views/documento.ejs`), {
          documento   : documento,
          referencias : referencias,
          adjuntos    : adjuntos,
          marginLeft  : (documento?.plantilla?.configuracionPagina?.margenIzquierdo || 4) + 'cm',
          marginRight : (documento?.plantilla?.configuracionPagina?.margenDerecho || 3) + 'cm',
          shortCodes  : shortCodes
        });
        
        const headerUrl = `${config.app.BACKEND_URL_LOCAL}/public/generarHeaderPdfDocumento/${documento.id}?idUsuario=${idUsuario}`;
        const headerPath = `/tmp/header_${documento.id}.html`;

        const responseHeader = await axios.get(headerUrl);
        fs.writeFileSync(headerPath, responseHeader.data);

        const header = headerPath;
        //const header = '/tmp/header_test.html';
        const footer =  `${config.app.BACKEND_URL_LOCAL}/public/generarFooterPdfDocumento?tipo=${documento.plantilla.idCategoria}&id=${documento.id}&idUsuario=${idUsuario}`;
        const options = {
          pageSize     : documento?.plantilla?.configuracionPagina?.tamanioPagina?.nombre === 'OFICIO' ? 'legal' : 'letter' || 'letter',
          // marginLeft   : (documento?.plantilla?.configuracionPagina?.margenIzquierdo || 4) + 'cm',
          // marginRight  : (documento?.plantilla?.configuracionPagina?.margenDerecho || 3) + 'cm',
          marginLeft   : '0cm',
          marginRight  : '0cm',
          marginTop    : (documento?.plantilla?.configuracionPagina?.margenSuperior || 3)  + 'cm',
          marginBottom : (documento?.plantilla?.configuracionPagina?.margenInferior || 3) + 'cm',
          output       : outPath
        };
        let pdfGenerado = false;
        if (documento.plantillaPdf) {
          pdfGenerado = await generateFromPlantillaPDF({
            idUsuario,
            documento,
            documentoPath: outPath
          });
        }
        if (!pdfGenerado) {
          fs.writeFileSync('debug-html.html', html);
          await createPdf(html, options, header, footer);
        }

        const uploadFilter = documento.plantilla.configuracion_json.filter(d => d.type === 'upload' && d.typeInput === 'pdf' && d.mergePdf);
        const listFile = [];
        // const lineFile = fs.readFileSync(outPath, 'utf-8');
        // const versionMaxima = versionPdf(lineFile.split(/\r?\n/)[0]);
        listFile.push(outPath);
        uploadFilter.forEach(upload => {
          upload.value.valores.forEach(merge => {
            const filenameUpload = merge.value.split('/').pop();
            const filepathUpload = `files/documentos/uploads/${filenameUpload}`;
            listFile.push(path.join(process.cwd(), filepathUpload));
          });
        });

        await PdfMergeHelper.mergeDocument(listFile, outPath);

        const file = fs.statSync(outPath).size;
        console.log('==========_TAMAÑO_DE_ARCHIVO_==========');
        console.log(file / (1024 * 1024), file);
        if (file / (1024 * 1024) > 8) throw new Error('Error de la Agetic, no permite enviar documentos mayores a 8MB para su aprobación.');
      }
      let respuesta = locationFile;
      if (leer) respuesta = fs.readFileSync(outPath, 'base64');
      return respuesta;
    } catch (error) {
      console.error(error)
      if (fs.existsSync(outPath)) fs.renameSync(outPath, `${fileStoragePath}/documentos/generados/borrados/${id}-BORRADO.pdf`);
      throw new Error(error.message);
    }
  }

  async function versionPdf (version, cantidad = 0) {
    try {
      const codigos = version.replace('%PDF-', '').split('.');
      let codigo = 0;
      if (cantidad === 0) {
        cantidad = codigos.length;
      }
      for (let index = 0; index < cantidad; index++) {
        if (index < codigos.length) {
          codigo = (codigo * 1000) + parseInt(codigos[index]);
        } else {
          codigo = codigo * 1000;
        }
      }
      return { codigo, cantidad: codigos.length };
    } catch (error) {
      return { codigo: 0, cantidad: 0 };
    }
  }

  async function generarPdfDocumento (params) {
    try {
      const documento = params;
      return documento;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function aprobacionCiudadania (documento, usuario, descripcion = '', urlRedireccionCliente = '', accion = 'CERRAR') {
    let locationFile;
    debug(descripcion);
    if (!documento.rutaPdf) {
      locationFile = await generarPdf(documento.id, false);
    }
    try {
      const respuestaAprobacion = await iniciarProcesoAprobacion(
        documento, usuario.id, `Documento - ${documento.asunto}`, urlRedireccionCliente, accion
      );
      respuestaAprobacion.rutaPdf = locationFile;
      return respuestaAprobacion;
    } catch (err) {
      throw new Error(`Error iniciando aprobación con ciudadanía digital ${err.message}`);
    }
  }

  function parsearDerivacion (configuracionJson) {
    for (const componente of configuracionJson) {
      if (componente.type === 'derivacion') {
        if (Array.isArray(componente.value?.valores?.de)) {
          for (const valueDe of componente.value?.valores?.de) {
            if (!valueDe.hasOwnProperty('visiblePdf')) {
              valueDe.visiblePdf = true;
            }
          }
        } else if (componente.value?.valores?.de) {
          if (!componente.value?.valores?.de.hasOwnProperty('visiblePdf')) {
            componente.value.valores.de.visiblePdf = true;
          }
        }

        if (Array.isArray(componente.value?.valores?.via)) {
          for (const valueVia of componente.value?.valores?.via) {
            if (!valueVia.hasOwnProperty('visiblePdf')) {
              valueVia.visiblePdf = true;
            }
          }
        } else if (componente.value?.valores?.via) {
          if (!componente.value?.valores?.via.hasOwnProperty('visiblePdf')) {
            componente.value.valores.via.visiblePdf = true;
          }
        }

        if (Array.isArray(componente.value?.valores?.para)) {
          for (const valuePara of componente.value?.valores?.para) {
            if (!valuePara.hasOwnProperty('visiblePdf')) {
              valuePara.visiblePdf = true;
            }
          }
        } else if (componente.value?.valores?.para) {
          if (!componente.value?.valores?.para.hasOwnProperty('visiblePdf')) {
            componente.value.valores.para.visiblePdf = true;
          }
        }
      }
    }
  }

  async function findOne (params = {}) {
    debug('Obteniendo menú del rol seleccionado');
    try {
      const documento = await DocumentoRepository.findOne(params);
      if (documento) {
        let flujoDerivaciones = [];
        // if (documento.estado !== 'CERRADO') {
        const { rows } = await FlujoDerivacionRepository.findAll({ idDocumento: documento.id, idFlujo: documento.idFlujo, estadoActual: 'ACTIVO' });
        flujoDerivaciones = rows;
        // }
        documento.flujoDerivaciones = flujoDerivaciones;
      }
      parsearDerivacion(documento.plantilla.configuracion_json);
      return documento;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function cantidadExtra (params = {}) {
    debug('Obteniendo la cantidad de informacion extra del documento');
    try {
      const cantidades = await DocumentoRepository.cantidadExtra({ id: params.id });
      return cantidades;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function superBuscador (params) {
    try {
      if (params.fechaInicio) params.fechaInicio = FechaHelper.formatearFecha(params.fechaInicio);
      if (params.fechaFin) params.fechaFin = FechaHelper.formatearFecha(params.fechaFin);
      if (params.fechaDocumento) params.fechaDocumento = FechaHelper.formatearFecha(params.fechaDocumento);

      const documentos = await DocumentoRepository.superBuscador(params);
      return documentos;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function superBuscadorDocumentos (params) {
    try {
      if (params.fechaInicio) params.fechaInicio = FechaHelper.formatearFecha(params.fechaInicio);
      if (params.fechaFin) params.fechaFin = FechaHelper.formatearFecha(params.fechaFin);
      if (params.fechaDocumento) params.fechaDocumento = FechaHelper.formatearFecha(params.fechaDocumento);

      const documentos = await DocumentoRepository.superBuscadorDocumentos(params);
      for (let documento of documentos.rows) {
        if (documento.clasificacion === 'CONFIDENCIAL' || !!documento.docconfidencial) {
          documento = await verificarConfidencialidad({ usuario: params.usuario, roles: params.roles, documento: documento, flujoDocumental: documento.id_flujo });
        }
      }
      return documentos;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function superBuscadorTramites (params) {
    try {
      if (params.fechaInicio) params.fechaInicio = FechaHelper.formatearFecha(params.fechaInicio);
      if (params.fechaFin) params.fechaFin = FechaHelper.formatearFecha(params.fechaFin);
      if (params.fechaDocumento) params.fechaDocumento = FechaHelper.formatearFecha(params.fechaDocumento);

      const documentos = await DocumentoRepository.superBuscadorTramites(params);
      for (const documento of documentos.rows) {
        if (documento.configuracionDerivaciones) {
          const unidadRemitente = documento.configuracionDerivaciones.find(doc => doc.tipo === 'REMITENTE');
          if (unidadRemitente) {
            documento.unidadRemitente = unidadRemitente.area;
          } else {
            documento.unidadRemitente = null;
          }
          // documento.unidadRemitente = unidadRemitente.area
        }
      }

      return documentos;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function verificarConfidencialidad (parametros) {
    const { usuario, roles, documento, flujoDocumental } = parametros;
    const perteneceFlujo = documento.configuracion_derivaciones.find(c => c.idUsuario === usuario);
    const tienePermiso = await PermisoRepository.verificarPermisos({ roles: roles, permisos: ['ver:flujos:confidencial'] });
    if (tienePermiso || perteneceFlujo) {
      return documento;
    } else {
      documento.clasificacion = 'CONFIDENCIAL';
      return documento;
    }
  }

  async function actualizarFechaDocumento (data) {
    try {
      data.fechaDocumento = FechaHelper.formatearFecha(data.fechaDocumento);

      const documento = await DocumentoRepository.createOrUpdate(data);
      return documento;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function valoresDocumento (params) {
    try {
      const documento = await DocumentoRepository.findOne(params);

      if (!documento) throw new Error(`El documento con el cite ${params.cite} no existe`);

      const valores = {
        flujo: {
          hojaRuta      : documento.flujoDocumental?.codigoFlujo,
          tipo          : documento.flujoDocumental?.tipo,
          estado        : documento.flujoDocumental?.estado,
          clasificacion : documento.flujoDocumental?.clasificacion
        },
        documento: {
          asunto         : documento.asunto,
          cite           : documento.cite,
          tipo           : documento.plantilla?.tipo,
          sigla          : documento.plantilla?.sigla,
          estado         : documento.estado,
          fechaDocumento : documento.plantilla?.fechaDocumento,
          palabrasClave  : documento.plantilla?.palabrasClave
        },
        valores: {}
      };

      for (const valor of documento.plantillaValor) {
        valores.valores[valor.name] = valor.valores;
      }

      return valores;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function clonarAdjuntosReferencias (idDocumento, idNuevoDocumento, t) {
    let transaccion;
    try {
      transaccion = t || await transaction.create();
      const { rows: adjuntos } = await ArchivoAdjuntoRepository.findAll({ idDocumento }, transaccion);
      const { rows: referencias } = await ReferenciaDocumentoRepository.findAll({ idDocumento }, transaccion);
      const { rows: compartidos } = await DocumentoCompartidoRepository.findAll({ idDocumento }, transaccion);

      for (const adjunto of adjuntos) {
        adjunto.idDocumento = idNuevoDocumento;
        delete adjunto.id;
        await ArchivoAdjuntoRepository.createOrUpdate(adjunto, transaccion);
      }

      for (const referencia of referencias) {
        referencia.idDocumento = idNuevoDocumento;
        delete referencia.id;
        await ReferenciaDocumentoRepository.createOrUpdate(referencia, transaccion);
      }

      for (const compartido of compartidos) {
        await DocumentoCompartidoRepository.createOrUpdate({
          idDocumento     : idNuevoDocumento,
          idUsuarioOrigen : compartido.idUsuarioOrigen,
          idUsuario       : compartido.idUsuario,
          visto           : false,
          aprobado        : false,
          tipo            : compartido.tipo,
          comentarios     : compartido.comentarios,
          detalle         : compartido.detalle,
          userCreated     : compartido.userCreated
        }, transaccion);
      }

      if (!t) await transaction.commit(transaccion);
    } catch (error) {
      if (!t) await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function getDatosUsuario (idUsuario, transaccion) {
    const usuario = await UsuarioRepository.findOne({ id: idUsuario }, transaccion);

    if (!usuario) throw new Error('El usuario no existe');

    return {
      id      : usuario.id,
      nombre  : `${usuario.nombres} ${usuario.primerApellido} ${usuario.segundoApellido}`,
      idCargo : usuario.cargoUsuario?.id,
      cargo   : usuario.cargoUsuario.descripcion
    };
  }

  async function correccionDocumento (data) {
    let transaccion;
    try {
      transaccion = await transaction.create();
      const documento =  await DocumentoRepository.findOne({ id: data.idDocumento }, transaccion);

      if (!documento) throw new Error('El documento no existe o no se encuentra');

      if (documento.estado === 'OBSERVADO') throw new Error('No se pueden corregir documentos observados');

      const derivacionActual = await FlujoDerivacionRepository.findOne({ idFlujo: documento.idFlujo, estadoActual: 'ACTIVO' }, transaccion);
      if (!derivacionActual) throw new Error('Error al recuperar la derivacion actual.');

      if (derivacionActual.tipo !== 'PROVEIDO') throw new Error('No se puede corregir el documento, por que el documento actual esta pendiente.');

      await DocumentoRepository.createOrUpdate({ id: documento.id, estado: 'OBSERVADO', editable: false }, transaccion);

      const idDocumentoOriginal = documento.id;

      documento.estado = 'DERIVADO';
      documento.editable = true;
      documento.firmado = false;
      documento.fechaDocumento = FechaHelper.formatearFecha(documento.fechaDocumento);
      delete documento.id;
      delete documento.linkFirma;
      delete documento.configuracionFinalizacion;
      if (documento.pathDocumentoFirma) {
        delete documento.pathDocumentoFirma;
      }

      const nuevoDocumento = await DocumentoRepository.createOrUpdate(documento, transaccion);

      const destinatario = documento.configuracionDerivaciones.find(x => x.inicial && x.tipo === 'REMITENTE');

      const remitente = await getDatosUsuario(data.idUsuario, transaccion);

      await AprobacionDocumentosRepository.deleteItemCond({ idFlujo: documento.idFlujo, idDocumento: idDocumentoOriginal }, transaccion);

      await clonarAdjuntosReferencias(idDocumentoOriginal, nuevoDocumento.id, transaccion);

      await FlujoDerivacionRepository.createOrUpdate({ id: derivacionActual.id, estadoActual: 'INACTIVO', estado: 'DERIVADO' }, transaccion);

      await FlujoDerivacionRepository.createOrUpdate({
        idFlujo                   : documento.idFlujo,
        idPaso                    : null,
        idDocumento               : nuevoDocumento.id,
        idUsuarioRemitente        : remitente.id,
        idCargoRemitente          : remitente.idCargo,
        nombreRemitente           : remitente.nombre,
        cargoRemitente            : remitente.cargo,
        idUsuarioDestinatario     : destinatario.idUsuario,
        idCargoDestinatario       : destinatario.idCargo,
        nombreDestinatario        : destinatario.nombreUsuario,
        cargoDestinatario         : destinatario.nombreCargo,
        idAccion                  : null,
        descripcion               : 'Correccion de documento',
        fechaRecepcion            : null,
        fechaDerivacion           : new Date(),
        observacion               : true,
        urgente                   : false,
        fechaPlazo                : null,
        tipo                      : 'REMITENTE',
        esatdo                    : 'INICIO',
        estadoActual              : 'ACTIVO',
        etapa                     : 'INICIO',
        informacionComplementaria : {
          remitente            : remitente,
          destinatario         : destinatario,
          idDocumentoObservado : idDocumentoOriginal,
          idDocumentoNuevo     : nuevoDocumento.id,
          observacion          : true,
          descripcion          : 'Correccion de documento'
        },
        userCreated: data.idUsuario
      }, transaccion);

      await transaction.commit(transaccion);
      return documento;
    } catch (error) {
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function cambiarDocumento (data, idUsuario) {
    let transaccion;
    try {
      transaccion = await transaction.create();

      const existeDocumento = await DocumentoRepository.findOne({ id: data.id }, transaccion);

      if (!existeDocumento) throw new Error('El documento no existe o no se puede reemplazar');

      delete data.id;

      const documento = await DocumentoRepository.createOrUpdate(data, transaccion);

      let derivacion = await FlujoDerivacionRepository.findOne({ id: data.idDerivacion }, transaccion);

      if (!derivacion) throw new Error('Ocurrio un error al intentar recuperar datos de la derivacion.');

      if (existeDocumento.cite) {
        await DocumentoRepository.createOrUpdate({ id: existeDocumento.id, editable: false, estado: 'CANCELADO', userUpdated: idUsuario }, transaccion);
        await DocumentoRepository.createOrUpdate({ id: documento.id, idDocumentoPadre: existeDocumento.id, userUpdated: idUsuario }, transaccion);
        await FlujoDerivacionRepository.createOrUpdate({ id: data.idDerivacion, estado: 'DERIVADO', estadoActual: 'INACTIVO', etapa: 'FIN', userUpdated: idUsuario }, transaccion);
        derivacion = await FlujoDerivacionRepository.createOrUpdate({
          idFlujo                   : derivacion.idFlujo,
          idDocumento               : documento.id,
          idAccion                  : derivacion.idAccion,
          idPaso                    : derivacion.idPaso,
          observacion               : false,
          descripcion               : data.justificacion,
          idUsuarioRemitente        : derivacion.idUsuarioDestinatario,
          nombreRemitente           : derivacion.nombreDestinatario,
          idCargoRemitente          : derivacion.idCargoDestinatario,
          cargoRemitente            : derivacion.cargoDestinatario,
          idUsuarioDestinatario     : derivacion.idUsuarioDestinatario,
          nombreDestinatario        : derivacion.nombreDestinatario,
          idCargoDestinatario       : derivacion.idCargoDestinatario,
          cargoDestinatario         : derivacion.cargoDestinatario,
          tipo                      : 'REMITENTE',
          urgente                   : derivacion.urgente,
          fechaPlazo                : derivacion.fechaPlazo,
          fechaDerivacion           : new Date(),
          fechaRecepcion            : new Date(),
          estadoActual              : 'ACTIVO',
          estado                    : 'RECIBIDO',
          etapa                     : 'INICIO',
          userCreated               : idUsuario,
          informacionComplementaria : derivacion.informacionComplementaria
        }, transaccion);
      }

      if (!existeDocumento.cite) {
        derivacion = await FlujoDerivacionRepository.createOrUpdate({
          id                        : derivacion.id,
          idDocumento               : documento.id,
          estadoActual              : 'ACTIVO',
          estado                    : 'RECIBIDO',
          etapa                     : 'INICIO',
          userCreated               : idUsuario,
          informacionComplementaria : derivacion.informacionComplementaria
        }, transaccion);
      }

      await ejecutarInteroperabilidades(documento.id, 'ejecutarGuardar', data.userCreated || data.userUpdated, transaccion);

      await transaction.commit(transaccion);

      return derivacion.id;
    } catch (error) {
      console.log('==========_ERROR_A_MOSTRARSE_CAMBIAR_DOCUMENTO_==========');
      console.log(error);
      console.log('=========================================================');
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function cancelarDocumento (data, idUsuario) {
    let transaccion;
    try {
      transaccion = await transaction.create();
      console.log('==========_MENSAJE_A_MOSTRARSE_CANCELAR_DOCUMENTO_==========');
      console.log(data);
      console.log('==========_MENSAJE_A_MOSTRARSE_CANCELAR_DOCUMENTO_==========');

      const existeDocumentoCancelar = await DocumentoRepository.findOne({ id: data.idDocumentoCancelar }, transaccion);
      if (!existeDocumentoCancelar) throw new Error('Error al recuperar datos del documento que quiere cancelar.');

      const existeDocumentoCerrado = await DocumentoRepository.findOne({ id: data.idDocumento, estado: 'CERRADO' }, transaccion);
      if (!existeDocumentoCerrado) throw new Error('Error al recuperar datos del documento cerrado.');

      const derivacion = await FlujoDerivacionRepository.findOne({ id: data.idDerivacion }, transaccion);

      if (!derivacion) throw new Error('Ocurrio un error al recuperar datos de la derivacion.');

      await DocumentoRepository.createOrUpdate({ id: existeDocumentoCancelar.id, editable: false, estado: 'CANCELADO', userUpdated: idUsuario }, transaccion);
      await FlujoDerivacionRepository.createOrUpdate({ id: derivacion.id, estado: 'DERIVADO', estadoActual: 'INACTIVO', etapa: 'FIN', userUpdated: idUsuario }, transaccion);
      await FlujoDerivacionRepository.createOrUpdate({
        idFlujo                   : derivacion.idFlujo,
        idDocumento               : existeDocumentoCancelar.id,
        idAccion                  : derivacion.idAccion,
        idPaso                    : derivacion.idPaso,
        observacion               : false,
        descripcion               : data.justificacion,
        idUsuarioRemitente        : derivacion.idUsuarioDestinatario,
        nombreRemitente           : derivacion.nombreDestinatario,
        idCargoRemitente          : derivacion.idCargoDestinatario,
        cargoRemitente            : derivacion.cargoDestinatario,
        idUsuarioDestinatario     : null,
        nombreDestinatario        : 'CANCELACION DE DOCUMENTO',
        idCargoDestinatario       : null,
        cargoDestinatario         : null,
        tipo                      : 'PROVEIDO',
        urgente                   : derivacion.urgente,
        fechaPlazo                : derivacion.fechaPlazo,
        fechaDerivacion           : new Date(),
        fechaRecepcion            : new Date(),
        estadoActual              : 'ACTIVO',
        estado                    : 'RECIBIDO',
        etapa                     : 'INICIO',
        userCreated               : idUsuario,
        informacionComplementaria : derivacion.informacionComplementaria
      }, transaccion);

      const derivacionActual = await FlujoDerivacionRepository.createOrUpdate({
        idFlujo                   : derivacion.idFlujo,
        idDocumento               : existeDocumentoCerrado.id,
        idAccion                  : derivacion.idAccion,
        idPaso                    : derivacion.idPaso,
        observacion               : false,
        descripcion               : data.justificacion,
        idUsuarioRemitente        : null,
        nombreRemitente           : `RASIGNACION DE DOCUMENTO CON CITE: ${existeDocumentoCerrado.cite}`,
        idCargoRemitente          : null,
        cargoRemitente            : null,
        idUsuarioDestinatario     : derivacion.idUsuarioDestinatario,
        nombreDestinatario        : derivacion.nombreDestinatario,
        idCargoDestinatario       : derivacion.idCargoDestinatario,
        cargoDestinatario         : derivacion.cargoDestinatario,
        tipo                      : 'PROVEIDO',
        urgente                   : derivacion.urgente,
        fechaPlazo                : derivacion.fechaPlazo,
        fechaDerivacion           : new Date(),
        fechaRecepcion            : new Date(),
        estadoActual              : 'ACTIVO',
        estado                    : 'RECIBIDO',
        etapa                     : 'INICIO',
        userCreated               : idUsuario,
        informacionComplementaria : derivacion.informacionComplementaria
      }, transaccion);

      await transaction.commit(transaccion);
      console.log('==========_MENSAJE_A_MOSTRARSE_==========');
      console.log(derivacionActual.id);
      console.log('==========_MENSAJE_A_MOSTRARSE_==========');
      return derivacionActual.id;
    } catch (error) {
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function verFirmas (params) {
    try {
      const documento = await DocumentoRepository.findOne(params);
      if (!documento) {
        throw new Error('El documento no existe');
      }
      const palabrasClave = documento.palabrasClave;
      const adjuntos = await ArchivoAdjuntoRepository.findAll({ idDocumento: params.id });
      const documentosAdjuntos = adjuntos.rows;
      if (documento.estado === 'OBSERVADO') {
        const documentoHijo = await DocumentoRepository.findOneFilterId({ idDocumentoPadre: params.id });
        if (!documentoHijo) {
          throw new Error('El documento no existe');
        }
        let observaciones = {};
        const flujoDerivacion = await FlujoDerivacionRepository.findOneSimple({ idDocumento: documentoHijo.id, observacion: true });
        if (flujoDerivacion) {
          const nombre = `${flujoDerivacion.usuarioRemitente.nombres} ${flujoDerivacion.usuarioRemitente.primerApellido} ${flujoDerivacion.usuarioRemitente.segundoApellido}`;
          observaciones = {
            estado             : 'OBSERVADO',
            avatar             : flujoDerivacion.usuarioRemitente.nombres.charAt(0),
            observacion        : flujoDerivacion.descripcion,
            usuarioObservacion : nombre.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            usuarioCargo       : flujoDerivacion.usuarioRemitente.cargo,
            fecha              : flujoDerivacion.fechaRecepcion
          };
        }

        return {
          observacion     : observaciones,
          adjuntos        : documentosAdjuntos,
          firmas          : [],
          flujoDocumental : {},
          palabrasClave
        };
      }
      if (documento.estado === 'CANCELADO' || documento.estado === 'INVALIDO') {
        return {
          observacion     : {},
          adjuntos        : documentosAdjuntos,
          firmas          : [],
          flujoDocumental : {},
          palabrasClave
        };
      }
      const participantes = documento.configuracionDerivaciones.map(item => {
        return {
          area          : item.area,
          idUsuario     : item.idUsuario,
          nombreUsuario : item.nombreUsuario,
          nombreCargo   : item.nombreCargo,
          tipo          : item.tipo
        };
      });
      const { rows: firmas } = await AprobacionDocumentosRepository.findAll({ idDocumento: params.id, aceptado: true, introducido: true });
      if (firmas.length === 0) {
        if (documento.estado === 'BORRADOR' || !documento.idFlujo) {
          if (!documento.idFlujo) console.error('>>> Error al recuperar el flujo del documento: ' + documento.id)
          return {
            observacion     : {},
            firmas          : [],
            adjuntos        : documentosAdjuntos,
            flujoDocumental : {},
            palabrasClave
          };
        }
        let  pasoFlujoDocumento;
        const flujoDocumentalTotal = await DocumentoRepository.findAll({ idFlujo: documento.idFlujo, estado: ['CERRADO', 'DERIVADO', 'EN REVISIÓN', 'NUEVO', 'REQUIERE RESPUESTA', 'PROCESADO', 'DESPACHADO', 'ARCHIVADO'] });
        if (flujoDocumentalTotal.rows.length > 0) {
          const flujoDocumental = flujoDocumentalTotal.rows.map(doc => {
            return {
              id              : doc.id,
              nombre          : doc.plantilla.nombre,
              fechaDocumento  : doc.fechaDocumento,
              asunto          : doc.asunto,
              cite            : doc.cite,
              estado          : doc.estado,
              documentoActual : documento.id === doc.id,
              createdAt       : doc.createdAt
            };
          });
          for (let i = 0; i < flujoDocumental.length; i++) {
            flujoDocumental[i].anterior = i > 0
              ? {
                  id     : flujoDocumental[i - 1].id,
                  asunto : flujoDocumental[i - 1].asunto,
                  nombre : flujoDocumental[i - 1].nombre,
                  cite   : flujoDocumental[i - 1].cite
                }
              : null;
            flujoDocumental[i].siguiente = i < flujoDocumental.length - 1
              ? {
                  id     : flujoDocumental[i + 1].id,
                  asunto : flujoDocumental[i + 1].asunto,
                  nombre : flujoDocumental[i + 1].nombre,
                  cite   : flujoDocumental[i + 1].cite
                }
              : null;
          }
          pasoFlujoDocumento = flujoDocumental.find(flujo => flujo.documentoActual);
        } else {
          pasoFlujoDocumento = {};
        }

        return {
          observacion     : {},
          firmas          : [],
          adjuntos        : documentosAdjuntos,
          flujoDocumental : pasoFlujoDocumento,
          palabrasClave
        };
      }
      for (const participante of participantes) {
        participante.avatar = participante.nombreUsuario.charAt(0);
        participante.nombreUsuario = participante.nombreUsuario.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        // participante.nombreCargo = participante.nombreCargo.charAt(0).toUpperCase() + participante.nombreCargo.slice(1).toLowerCase();
        const exiteFirma = firmas.find(firma => firma.idUsuario === participante.idUsuario);
        if (exiteFirma) {
          participante.estado = 'FIRMADO';
          participante.fechaSolicitud = exiteFirma.fecha_hora_solicitud;
        } else {
          participante.estado = 'FALTA';
        }
      }

      let pasoFlujoDocumento;
      const flujoDocumentalTotal = await DocumentoRepository.findAll({ idFlujo: documento.idFlujo, estado: ['CERRADO', 'DERIVADO', 'EN REVISIÓN', 'NUEVO', 'REQUIERE RESPUESTA', 'PROCESADO', 'DESPACHADO', 'ARCHIVADO'] });
      if (flujoDocumentalTotal.rows.length > 0) {
        const flujoDocumental = flujoDocumentalTotal.rows.map(flujo => {
          return {
            id              : flujo.id,
            nombre          : flujo.plantilla.nombre,
            fechaDocumento  : flujo.fechaDocumento,
            asunto          : flujo.asunto,
            cite            : flujo.cite,
            estado          : flujo.estado,
            documentoActual : documento.id === flujo.id,
            createdAt       : flujo.createdAt
          };
        });
        for (let i = 0; i < flujoDocumental.length; i++) {
          flujoDocumental[i].anterior = i > 0
            ? {
                id     : flujoDocumental[i - 1].id,
                asunto : flujoDocumental[i - 1].asunto,
                nombre : flujoDocumental[i - 1].nombre,
                cite   : flujoDocumental[i - 1].cite
              }
            : null;
          flujoDocumental[i].siguiente = i < flujoDocumental.length - 1
            ? {
                id     : flujoDocumental[i + 1].id,
                asunto : flujoDocumental[i + 1].asunto,
                nombre : flujoDocumental[i + 1].nombre,
                cite   : flujoDocumental[i + 1].cite
              }
            : null;
        }
        pasoFlujoDocumento = flujoDocumental.find(flujo => flujo.documentoActual);
      } else {
        pasoFlujoDocumento = {};
      }

      return {
        observacion     : {},
        firmas          : participantes,
        adjuntos        : documentosAdjuntos,
        flujoDocumental : pasoFlujoDocumento,
        palabrasClave
      };
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function agregarPalabrasClave (data) {
    try {
      const documento = await DocumentoRepository.findOne({ id: data.id });
      if (!documento) {
        throw new Error('El documento no existe');
      }
      const palabrasClave = documento.palabrasClave;
      const nuevaPlantilla = documento.plantilla;
      palabrasClave.push(data.palabra);
      nuevaPlantilla.palabrasClave = palabrasClave;
      // console.log(nuevaPlantilla);
      const documentoModificado = await DocumentoRepository.createOrUpdate({ id: data.id, palabrasClave, plantilla: nuevaPlantilla, userUpdated: data.userUpdated });
      return palabrasClave.sort((a, b) => a.length - b.length);
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function borrarPalabrasClave (data) {
    try {
      const documento = await DocumentoRepository.findOne({ id: data.id });
      if (!documento) {
        throw new Error('El documento no existe');
      }
      const palabrasClave = documento.palabrasClave.filter(pal => pal !== data.palabra);
      const nuevaPlantilla = documento.plantilla;
      // palabrasClave.push(data.palabra);
      nuevaPlantilla.palabrasClave = palabrasClave;
      // // console.log(nuevaPlantilla);
      const documentoModificado = await DocumentoRepository.createOrUpdate({ id: data.id, palabrasClave, plantilla: nuevaPlantilla, userUpdated: data.userUpdated });
      return palabrasClave.sort((a, b) => a.length - b.length);
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function verAdjuntos (params) {
    try {
      const documento = await DocumentoRepository.findOne(params);
      if (!documento) {
        throw new Error('El documento no existe');
      }
      const adjuntos = await ArchivoAdjuntoRepository.findAll({ idDocumento: params.id });
      return adjuntos.rows;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function registroBitacoraDocumento (params) {
    try {
      const respuesta = await BitacoraRepository.createOrUpdate({
        idItem        : params.id,
        idUsuario     : params.idUsuario,
        userCreated   : params.idUsuario,
        justificacion : null,
        accion        : params.accion || BITACORA.ACCION_DESCARGAR_DOCUMENTO,
        nombreTabla   : DocumentoRepository.getTableName()
      });
      return {
        id: respuesta.id,
        accion: respuesta.accion,
        fecha: respuesta.createdAt
      };
    } catch (error) {
      console.error(error);
      throw new ErrorApp(error.message, 400);
    }
  }
  function formatoFechaLiteral (fechaStr) {
    const fecha = fechaStr ? new Date(fechaStr + ' 23:59:59') : new Date();
    const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
    return fecha.toLocaleDateString('es-ES', opciones);
  }

  return {
    cancelarDocumento,
    cambiarDocumento,
    findAll,
    correccionDocumento,
    valoresDocumento,
    actualizarFechaDocumento,
    superBuscador,
    findOne,
    getFormulariosComponentes,
    vistoBuenoCreacion,
    vistoBuenoDerivacion,
    listarpor,
    listar,
    aceptar,
    observar,
    observarFlujoFisico,
    correccionFlujoFisico,
    getObservacionFlujoFisico,
    subsanarObservacion,
    despachar,
    solicitudCerrar,
    solicitudArchivar,
    deleteItem,
    esVisibleParaUsuario,
    generarPdf,
    generarPlantillaWord,
    vistaFile,
    generarPdfDocumento,
    createOrUpdate,
    existPathPDF,
    cantidadExtra,
    verFirmas,
    verAdjuntos,
    superBuscadorDocumentos,
    superBuscadorTramites,
    registroBitacoraDocumento,
    agregarPalabrasClave,
    borrarPalabrasClave,
    establecerPlantillaPdf
  };
};
