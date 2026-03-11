const debug = require('debug')('app:service:FlujoDerivacion');
const { ErrorApp } = require('../../lib/error');
const wkhtmltopdf = require('wkhtmltopdf');
const ejs = require('ejs');
const path = require('path');
const { config } = require('../../../common');
const fs = require('fs');
const { error } = require('console');

module.exports = function CorrelativoService (repositories, helpers) {
  const {
    FlujoDocumentalRepository,
    FlujoDerivacionRepository,
    DocumentoRepository,
    ArchivoAdjuntoRepository,
    ReferenciaDocumentoRepository,
    DocumentoCompartidoRepository,
    AprobacionDocumentosRepository,
    SolicitudPlantillaRepository,
    PasoRepository,
    UsuarioRepository,
    transaction
  } = repositories;
  const { FechaHelper } = helpers;

  const { verificarPermisos } = require('../system/AuthService')(repositories, helpers);

  async function listar (params) {
    try {
      debug(params);
      const documentos = await FlujoDocumentalRepository.findAll(params);
      return documentos;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function listarFlujo (params) {
    try {
      const documentos = await FlujoDocumentalRepository.findAllBook(params);
      return documentos;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function createPdf (html, pdfOptions = {}, header) {
    const opt = {
      headerHtml   : header,
      pageSize     : pdfOptions.pageSize     || 'letter',
      marginLeft   : pdfOptions.marginLeft   || '2.5cm',
      marginRight  : pdfOptions.marginRight  || '2cm',
      marginTop    : pdfOptions.marginTop    || '3.3cm',
      marginBottom : pdfOptions.marginBottom || '2cm',
      output       : pdfOptions.output       || '/tmp/documento.pdf'
    };

    return new Promise((resolve, reject) => {
      wkhtmltopdf(html, opt, (err) => {
        if (err) { return reject(err); }
        resolve();
      });
    });
  }

  async function printBook (params) {
    const { rootPath, fileStoragePath } = config.app;
    try {
      const { rows } = await FlujoDocumentalRepository.findAllBook(params);
      params.rows = rows.map(row => row.dataValues);
      const header = `${config.app.BACKEND_URL_LOCAL}/public/generarHeaderPdfDocumento/no-document`;
      const locationFile = `/documentos/generados/pdf/LIBRO-${Date.now()}.pdf`;
      const outPath = path.resolve(`${fileStoragePath}${locationFile}`);
      const html = await ejs.renderFile(path.resolve(`${rootPath}/../../views/libro.ejs`), { flujo: params });
      await createPdf(html, { output: outPath }, header);
      const respuesta = fs.readFileSync(outPath, 'base64');
      return respuesta;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function findOne (params = {}, query = {}) {
    debug('Mostrando flujo documental: ', params);
    try {
      const permisos = await FlujoDocumentalRepository.findOne(params, query);
      return permisos;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function listarDocumentos (idFlujoDocumental, usuario = null) {
    try {
      const documentos = await FlujoDocumentalRepository.listarDocumentos({ idFlujo: idFlujoDocumental, nivel: 1 });
      if (documentos.count) {
        for (const documento of documentos.rows) {
          if (documento.docconfidencial) {
            console.log('USUARIO', usuario);
            
            const tienePermiso = await verificarPermisos({ roles: usuario.idRoles, permisos: ['ver:documento:confidencial'] });
            const esParticipante = usuario 
              ? documento.configuracionDerivaciones.find(c => c.idUsuario === usuario.idUsuario) 
              : null;
            const esParticipanteFlujo = await FlujoDerivacionRepository.findOne({
              idFlujo: idFlujoDocumental,
              idUsuario: usuario.idUsuario,
              idDocumento: documento.id
            });            
            documento.docconfidencial = !(esParticipanteFlujo || tienePermiso || esParticipante);
          }
          const { rows } = await ArchivoAdjuntoRepository.findAll({ idDocumento: documento.id });
          documento.adjuntos = rows;
          const children = await FlujoDocumentalRepository.listarDocumentos({
            idFlujo: idFlujoDocumental,
            nivel: 2,
            id : documento.id,
            cite : documento.cite
          });
          documento.children = children.rows;
        }
      }
      return documentos;
    } catch (err) {
      console.error(err);
      throw new ErrorApp(err.message, 400);
    }
  }

  async function create (data) {
    try {
      const flujoDocumental = await FlujoDocumentalRepository.createOrUpdate(data);
      return flujoDocumental;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function update (data) {
    try {
      const flujoDocumental = await FlujoDocumentalRepository.update(data);
      return flujoDocumental;
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

  async function recuperarDerivacion (datos) {
    let transaccion;
    try {
      transaccion = await transaction.create();

      const accion = datos.tipo === 'RECUPERADO' ? 'recuperar' : 'rechazar';

      const flujoDocumental = await FlujoDocumentalRepository.findOne({ id: datos.id }, {}, transaccion);

      if (!flujoDocumental) throw new Error('La hoja de ruta no existe.');

      if (flujoDocumental.estado !== 'PENDIENTE') throw new Error(`No puede ${accion} esta hoja de ruta, por que no esta PENDIENTE.`);

      const flujoDerivacionActual = await await FlujoDerivacionRepository.findOne({ idFlujo: datos.id, estadoActual: 'ACTIVO' }, transaccion);

      // if (flujoDerivacionActual.idPaso && !flujoDocumental?.solicitudPlantilla?.docfisico) throw new Error('No puede recuperar tramites del tipo SIPFA.');

      if (!flujoDerivacionActual) throw new Error('No se encontro la derivacion actual.');

      if (flujoDerivacionActual.fechaRecepcion) throw new Error(`El documento ya fue recepcionado y no se puede ${accion}.`);

      if (![flujoDerivacionActual.idUsuarioRemitente, flujoDerivacionActual.idUsuarioDestinatario].includes(datos.idUsuario)) throw new Error(`No se puede ${accion} el documento porque no es el usuario que lo derivo.`);

      if (flujoDerivacionActual.idUsuarioRemitente === flujoDerivacionActual.idUsuarioDestinatario) throw new Error(`No se puede ${accion} el documento porque usted ya creo un documento.`);

      const fecha = new Date();

      let idDocumento = flujoDerivacionActual.idDocumento;

      const documento = await DocumentoRepository.findOne({ id: flujoDerivacionActual.idDocumento }, transaccion);

      if (!documento) throw new Error(`No se puede ${accion}, error al ${accion} el documento.`);

      const remitenteInicial = documento.configuracionDerivaciones.find(x => x.inicial);

      const esUnicoRemitente = documento.configuracionDerivaciones.length === 1;

      console.log(`========================================== ES REMITENTE INICIAL RECUPERACION:  ${datos.idUsuario === remitenteInicial?.idUsuario}`);
      
      if (
        (
          (
            datos.idUsuario === remitenteInicial?.idUsuario
            && datos.tipo === 'RECUPERADO'
          )
          || (
            flujoDerivacionActual.idUsuarioRemitente === remitenteInicial?.idUsuario 
            && datos.tipo !== 'RECUPERADO'
          )
        )
        && (
          flujoDerivacionActual.tipo !== 'PROVEIDO'
          || (
            flujoDerivacionActual.tipo === 'PROVEIDO'
            && datos.idUsuario === remitenteInicial?.idUsuario
            && esUnicoRemitente
          )
        )
        && !flujoDocumental?.solicitudPlantilla?.docfisico
      ) {
        console.log('======================================== REMNITENTE INICIAL RECUPERAClON', `${remitenteInicial.nombreUsuario} `);
        await DocumentoRepository.createOrUpdate({ id: documento.id, estado: 'CANCELADO' }, transaccion);

        await AprobacionDocumentosRepository.deleteItemCond({ idFlujo: flujoDocumental.id, idDocumento: documento.id }, transaccion);

        const idDocumentoOriginal = documento.id;
        delete documento.id;
        delete documento.createdAt;
        delete documento.updatedAt;
        if (documento.pathDocumentoFirma) {
          delete documento.pathDocumentoFirma;
        }
        documento.linkFirma  = null;
        documento.nombrePdf = null;
        documento.editable = true;
        documento.fechaDocumento = FechaHelper.formatearFecha(documento.fechaDocumento);

        const nuevoDocumento = await DocumentoRepository.createOrUpdate(documento, transaccion);

        await clonarAdjuntosReferencias(idDocumentoOriginal, nuevoDocumento.id, transaccion);

        idDocumento = nuevoDocumento.id;
      } else if(
        (
          (
            (
              datos.idUsuario === remitenteInicial?.idUsuario
              || documento.userCreated === datos.idUsuario
            ) && datos.tipo === 'RECUPERADO'
          ) || (
            (
              flujoDerivacionActual.idUsuarioRemitente === remitenteInicial?.idUsuario
              || documento.userCreated === flujoDerivacionActual.idUsuarioRemitente
            ) && datos.tipo !== 'RECUPERADO'
          )
        )
        && flujoDocumental?.solicitudPlantilla?.docfisico
      ) {
        await DocumentoRepository.createOrUpdate({ id: documento.id, estado: 'BORRADOR', editable: true }, transaccion);
      }

      await FlujoDerivacionRepository.createOrUpdate({ id: flujoDerivacionActual.id, estadoActual: 'INACTIVO', estado: 'DERIVADO' }, transaccion);

      await FlujoDerivacionRepository.createOrUpdate({
        idFlujo               : flujoDerivacionActual.idFlujo,
        idPaso                : null,
        idDocumento           : idDocumento,
        idUsuarioRemitente    : null,
        nombreRemitente       : datos.tipo === 'RECUPERADO' ? `${flujoDerivacionActual.nombreRemitente} RECUPERÓ LA HOJA DE RUTA.` : `${flujoDerivacionActual.nombreRemitente} RECHAZO LA HOJA DE RUTA.`,
        cargoRemitente        : '',
        idUsuarioDestinatario : flujoDerivacionActual.idUsuarioRemitente,
        nombreDestinatario    : flujoDerivacionActual.nombreRemitente,
        cargoDestinatario     : flujoDerivacionActual.cargoRemitente,
        idCargoDestinatario   : flujoDerivacionActual.idCargoRemitente,
        idAccion              : null,
        descripcion           : datos.proveido,
        fechaDerivacion       : fecha,
        fechaRecepcion        : fecha,
        observacion           : false,
        urgente               : false,
        fechaPlazo            : null,
        tipo                  : datos.tipo ?? 'RECUPERADO',
        estado                : 'RECIBIDO',
        estadoActual          : 'ACTIVO',
        etapa                 : flujoDerivacionActual.etapa,
        userCreated           : datos.idUsuario
      }, transaccion);

      await transaction.commit(transaccion);
      return flujoDerivacionActual;
    } catch (error) {
      console.error("ERROR RECUPERAR => ", error)
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function vinculadosPendientesFirma (idFlujoPadre) {
    try {
      const { rows } = await FlujoDocumentalRepository.findAll({ idFlujoPadre });

      for (const flujo of rows) {
        const existePendiente = await AprobacionDocumentosRepository.buscarPendiente(flujo.id);
        const usuario = await UsuarioRepository.findOne({ id: existePendiente.usuario.id });

        const nombreUsuario = `${usuario.nombres} ${usuario.primerApellido} ${usuario.segundoApellido}`;

        if (existePendiente) throw new Error(`En la HR ${flujo.codigoFlujo} vinculada, se tiene al usuario ${nombreUsuario} que no firmó un documento por lo que no puede derivar esta hoja de ruta.`);
      }

      return true;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function generarpdfisico (flujoDocumental, params = {}, leer = true)
  {
    // const solicitudPlantilla = await SolicitudPlantillaRepository.findOne({ id: flujoDocumental.idSolicitudPlantilla });
    const pasoInicial = await PasoRepository.findOne({ idSolicitudPlantilla: flujoDocumental.idSolicitudPlantilla, tipo: 'inicio' });
    const historial = await FlujoDocumentalRepository.historial({ id: flujoDocumental.id });
    const pasosIniciales = pasoInicial.pasosSiguientes.map(p => p.idPasoSiguiente)
    const listaDerivaciones = historial.flujoDerivaciones.filter(d => (
      pasosIniciales.includes(d.idPaso) 
      // && d.idCargoDestinatario
      && !['CANCELADO','OBSERVADO'].includes(d.documento.estado)
    ))
    if (listaDerivaciones.length === 0) {
      throw new Error('El documento inicial fue cancelado o se encuentra observado.');
    }
    const idDocumento = listaDerivaciones[listaDerivaciones.length - 1].documento.id 
    const documento = await DocumentoRepository.findOne({ id: idDocumento });
    if (!documento) {
      throw new Error('El documento inicial no existe o no se encuentra');
    }
    const remitenteInicial = documento.configuracionDerivaciones.find(d => d.inicial && d.tipo === 'REMITENTE')

    // new Set(listaDerivaciones.map(d => d.documento.id));
    const { rootPath, fileStoragePath, deletePath } = config.app;

    let locationFile = '/documentos/generados/pdf/flujo';
    let outPath = path.resolve(`${fileStoragePath}${locationFile}`);
    if (!fs.existsSync(outPath)) {
      fs.mkdirSync(outPath, { recursive: true });
    }
    outPath = `${outPath}/PLANTILLA-${flujoDocumental.id}.pdf`;
    const html = await ejs.renderFile(path.resolve(`${rootPath}/../../views/documentofisico.ejs`), {
      datos : { flujoDocumental, documento, remitenteInicial }
    });

    const header = `${config.app.BACKEND_URL_LOCAL}/public/generarHeaderPdfDocumentofisico/${documento.id}?idUsuario}`;
    const footer =  `${config.app.BACKEND_URL_LOCAL}/public/generarFooterPdfDocumento?tipo=${documento.plantilla.idCategoria}&id=${documento.id}&idUsuario=}`;
        
    const options = {
      pageSize     :  'letter',
      // marginLeft   : (documento?.plantilla?.configuracionPagina?.margenIzquierdo || 4) + 'cm',
      // marginRight  : (documento?.plantilla?.configuracionPagina?.margenDerecho || 3) + 'cm',
      marginLeft   : '1cm',
      marginRight  : '1cm',
      marginTop    : '2cm',
      marginBottom : '0cm',
      output       : outPath
    };
    await createPdf(html, options, header, footer);
    let respuesta = null;
    if (leer) respuesta = fs.readFileSync(outPath, 'base64');
    return respuesta;
  }

  async function historial (params = {}) {
    debug('Mostrando flujo documental: ', params);
    try {
      const historial = await FlujoDocumentalRepository.historial(params);
      return historial;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function historialPdf (params = {}) {
    debug('Mostrando flujo documental PDF: ', params);
    try {
      const historial = await FlujoDocumentalRepository.historial(params);
      if (historial.flujoDerivaciones.length === 0) {
        throw new Error('El documento inicial fue cancelado o se encuentra observado.');
      }
      const idDocumento = historial.flujoDerivaciones[historial.flujoDerivaciones.length - 1].documento.id 
      const documento = await DocumentoRepository.findOne({ id: idDocumento });
      if (!documento) {
        throw new Error('El documento inicial no existe o no se encuentra');
      }
      const { rootPath, fileStoragePath } = config.app;

      let outPath = path.resolve(`${fileStoragePath}${'/documentos/generados/pdf/flujo'}`);

      if (!fs.existsSync(outPath)) {
        fs.mkdirSync(outPath, { recursive: true });
      }
      outPath = `${outPath}/HISTORIAL-${historial.id}.pdf`;
      const html = await ejs.renderFile(path.resolve(`${rootPath}/../../views/historial.ejs`), {
        datos : { historial }
      });
      const header = `${config.app.BACKEND_URL_LOCAL}/public/generarHeaderPdfDocumentofisico/${documento.id}?codigo=date&idUsuario}`;
      const footer =  `${config.app.BACKEND_URL_LOCAL}/public/generarFooterPdfDocumento?tipo=${documento.plantilla.idCategoria}&id=${documento.id}&idUsuario=}`;
          
      const options = {
        pageSize     :  'letter',
        marginLeft   : '1cm',
        marginRight  : '1cm',
        marginTop    : '2cm',
        marginBottom : '0cm',
        output       : outPath
      };
      await createPdf(html, options, header, footer);
      let respuesta = null;
      respuesta = fs.readFileSync(outPath, 'base64');
      return respuesta;
    } catch (err) {
      console.error(err);
      throw new ErrorApp(err.message, 400);
    }
  }

  return {
    historial,
    generarpdfisico,
    vinculadosPendientesFirma,
    recuperarDerivacion,
    listarDocumentos,
    findOne,
    listar,
    listarFlujo,
    printBook,
    update,
    create,
    historialPdf
  };
};
