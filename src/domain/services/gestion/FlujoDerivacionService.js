const debug = require('debug')('app:service:FlujoDerivacion');
const { config } = require('../../../common');
const { constants } = require('../../../common/config');
const { ErrorApp } = require('../../lib/error');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const { ESTADO_FLUJO_DOCUMENTAL, ESTADO_DOCUMENTO } = require('../../../common/config/constants');

module.exports = function flujoDerivacionService (repositories, helpers, res) {
  const {
    FlujoDerivacionRepository, DocumentoRepository,
    PasoActualRepository,
    FlujoDocumentalRepository,
    transaction,
    ArchivoAdjuntoRepository,
    ReferenciaDocumentoRepository,
    UsuarioRepository,
    BandejaRepository,
    DocumentoCompartidoRepository,
    AprobacionDocumentosRepository,
    DocumentoObservacionRepository,
    UsuarioCargoRepository,
    ParametroRepository
  } = repositories;
  const SolicitudEjecucionService = require('../bpm/SolicitudEjecucionService')(repositories, helpers, res);
  const DocumentoService = require('./DocumentoService')(repositories, helpers, res);
  const ComponenteService = require('../bpm/ComponenteService')(repositories, helpers, res);
  const DerivacionService = require('./DerivacionService')(repositories, helpers, res);
  const { verificarHojaRutaCite, registrarAprobacionCiudadania, evaluarReglasExportacion } = require('../system/UtilService')(repositories, helpers, null);
  const { generarSolicitudSinValidacion } = require('../system/AprobacionDocumentosService')(repositories, helpers, null);
  const { checkCiudadaniaStatus } = require('../externos/CiudadanoService')(repositories, helpers, null);

  const { FechaHelper } = helpers;
  // const NotificacionService = require('../notificaciones/NotificacionService')(repositories, helpers, res);

  async function listar (params) {
    try {
      let registros = { rows: [], count: 0 };

      if (params.bandeja === 'entrada') registros = await BandejaRepository.entrada(params);
      if (params.bandeja === 'documentos') registros = await BandejaRepository.documentos(params);
      if (params.bandeja === 'pendiente') {
        const correcciones = await  DocumentoObservacionRepository.findAll({ idUsuarioObservado: params.idUsuarioDestinatario, corregido: false });
        if (correcciones.count) {
          const documents = new Set(correcciones.rows.map(c => c.idDocumento));
          params.idDocumento = Array.from(documents);
        }
        registros = await BandejaRepository.pendiente(params);
      }
      if (params.bandeja === 'compartido') registros = await BandejaRepository.compartidos(params);
      if (params.bandeja === 'firma') registros = await BandejaRepository.firma(params);
      if (params.bandeja === 'salida') registros = await BandejaRepository.salida(params);

      return registros;
    } catch (err) {
      console.error(err);
      throw new ErrorApp(err.message, 400);
    }
  }

  async function listarPendientesFirma (params) {
    try {
      const documentos = await AprobacionDocumentosRepository.pendientesFirma(params);
      return documentos;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function findOne (params) {
    try {
      const flujoDerivacion = await FlujoDerivacionRepository.findOne(params);
      return flujoDerivacion;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function cantidades (params) {
    try {
      if (params) {
        params.documentos = true;
        params.entrada = true;
        params.pendiente = true;
        params.firma = true;
        params.compartido = true;
      }
      const documentos = await FlujoDerivacionRepository.cantidades(params);
      return documentos;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  function nombreCompleto (usuario) {
    if (usuario) {
      return `${usuario.nombres} ${usuario.primerApellido} ${usuario.segundoApellido}`;
    }
    return '';
  }

  async function recepcionar (datos = {}, t) {
    let transaccion;
    let flujoDerivacion;
    try {
      transaccion = t || await transaction.create();

      const derivacion = await FlujoDerivacionRepository.findOne({ id: datos.id }, transaccion);

      if (!derivacion) throw new Error('Error al obtener la ultima derivacion');

      if (derivacion.estadoActual !== 'ACTIVO') throw new Error('No se puede recuperar la derivacion especificada.');

      if (derivacion.flujoDocumental?.idFlujoOrigen) {
        const flujoDocumentalEnlazado = await FlujoDocumentalRepository.findOne({ id: derivacion.flujoDocumental?.idFlujoOrigen });

        if (!flujoDocumentalEnlazado) throw new Error(`No se encuentra el flujo vinculado a la HR ${derivacion.flujoDocumental.codigoFlujo}`);

        if (!flujoDocumentalEnlazado.concluido) {
          const derivacionEnlazada = await FlujoDerivacionRepository.findOne({
            idFlujo               : derivacion.flujoDocumental?.idFlujoOrigen,
            idDocumento           : derivacion.idDocumento,
            idUsuarioRemitente    : derivacion.idUsuarioRemitente,
            idUsuarioDestinatario : derivacion.idUsuarioDestinatario
          }, transaccion);

          if (!derivacionEnlazada) throw new Error('No se encontro la derivacion en la otra entidad.');

          await FlujoDerivacionRepository.createOrUpdate({ id: derivacionEnlazada.id, fechaRecepcion: datos.fechaRecepcion }, transaccion);

          await FlujoDocumentalRepository.createOrUpdate({
            id        : derivacion.flujoDocumental?.idFlujoOrigen,
            estado    : constants.ESTADO_FLUJO_DOCUMENTAL.FINALIZADO,
            concluido : true
          }, transaccion);
        }
      }

      flujoDerivacion = await FlujoDerivacionRepository.createOrUpdate(datos, transaccion);

      if (derivacion.informacionComplementaria?.idRecepcionar) {
        await FlujoDerivacionRepository.createOrUpdate({
          id             : derivacion.informacionComplementaria?.idRecepcionar,
          fechaRecepcion : datos.fechaRecepcion,
          userUpdated    : datos.userUpdated
        }, transaccion);
      }

      if (!t) await transaction.commit(transaccion);

      return flujoDerivacion;
    } catch (error) {
      if (!t) await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function cloneOrCreateDocumento (idDocumento, idUsuario, t) {
    let transaccion;
    let nuevoDocumento;
    try {
      transaccion = t || await transaction.create();
      const documentoOriginal = await DocumentoRepository.findOne({ id: idDocumento }, transaccion);

      const { rows: adjuntos } = await ArchivoAdjuntoRepository.findAll({ idDocumento: documentoOriginal.id });

      const { rows: referencias } = await ReferenciaDocumentoRepository.findAll({ idDocumento: documentoOriginal.id });

      const { rows: compartidos } = await DocumentoCompartidoRepository.findAll({ idDocumento });

      if (!documentoOriginal) throw new Error('El documento seleccionado no se encuentra.');

      await DocumentoRepository.createOrUpdate({ id: documentoOriginal.id, estado: 'OBSERVADO' }, transaccion);

      const documentoNuevo = {
        idFlujo                   : documentoOriginal.idFlujo,
        hojaRuta                  : documentoOriginal.hojaRuta,
        configuracionDerivaciones : documentoOriginal.configuracionDerivaciones,
        cite                      : documentoOriginal.cite,
        asunto                    : documentoOriginal.asunto,
        plantilla                 : documentoOriginal.plantilla,
        plantillaValor            : documentoOriginal.plantillaValor,
        idDocumentoPadre          : documentoOriginal.id,
        fechaDocumento            : FechaHelper.formatearFecha(documentoOriginal.fechaDocumento),
        firmado                   : false,
        compartido                : documentoOriginal.compartido,
        configuracionFinalizacion : null,
        fechaCerrado              : null,
        estado                    : 'DERIVADO',
        editable                  : true,
        userCreated               : idUsuario
      };

      nuevoDocumento = await DocumentoRepository.createOrUpdate(documentoNuevo, transaccion);

      for (const adjunto of adjuntos) {
        adjunto.idDocumento = nuevoDocumento.id;
        delete adjunto.id;
        await ArchivoAdjuntoRepository.createOrUpdate(adjunto, transaccion);
      }

      for (const referencia of referencias) {
        referencia.idDocumento = nuevoDocumento.id;
        delete referencia.id;
        await ReferenciaDocumentoRepository.createOrUpdate(referencia, transaccion);
      }

      for (const compartido of compartidos) {
        await DocumentoCompartidoRepository.createOrUpdate({
          idDocumento     : nuevoDocumento.id,
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

      return nuevoDocumento;
    } catch (error) {
      if (!t) await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function observar (datos = {}) {
    let transaccion;
    try {
      transaccion = await transaction.create();
      const flujoDerivacion = await FlujoDerivacionRepository.findOne({ id: datos.id });

      if (!flujoDerivacion) throw new Error('Ocurrio un error al intentar observar.');

      await FlujoDerivacionRepository.createOrUpdate({ id: datos.id, estado: 'DERIVADO', estadoActual: 'INACTIVO', userUpdated: datos.idUsuario }, transaccion);

      const documentoAntiguo = await DocumentoRepository.findOne({ id: flujoDerivacion.idDocumento }, transaccion);

      if (!documentoAntiguo) throw new Error('No existe el documento a observarse.');

      const remitenteInicial = documentoAntiguo.configuracionDerivaciones.find(x => x.tipo === 'REMITENTE');

      const nuevoDocumento = await cloneOrCreateDocumento(flujoDerivacion.idDocumento, datos.idUsuario, transaccion);

      const usuarioRemitente = await UsuarioRepository.findOne({ id: datos.idUsuarioRemitente });

      const datosDerivacionObservacion = {
        idFlujo                   : documentoAntiguo.idFlujo,
        idDocumento               : nuevoDocumento.id,
        estado                    : 'INICIO',
        estadoActual              : 'ACTIVO',
        tipo                      : 'REMITENTE',
        idUsuarioDestinatario     : remitenteInicial.idUsuario,
        nombreDestinatario        : remitenteInicial.nombreUsuario,
        idCargoDestinatario       : remitenteInicial.idCargo,
        cargoDestinatario         : remitenteInicial.nombreCargo,
        idUsuarioRemitente        : datos.idUsuarioRemitente,
        nombreRemitente           : nombreCompleto(usuarioRemitente),
        cargoRemitente            : datos.cargoRemitente,
        idCargoRemitente          : datos.idCargoRemitente,
        observacion               : true,
        urgente                   : datos.urgente,
        descripcion               : datos.observacion,
        userCreated               : datos.idUsuario,
        fechaDerivacion           : new Date(),
        informacionComplementaria : {
          remitente: {
            nombre : nombreCompleto(usuarioRemitente),
            cargo  : datos.cargoRemitente
          },
          destinatario: {
            nombre : remitenteInicial.nombreUsuario,
            cargo  : remitenteInicial.nombreCargo
          },
          descripcion : datos.observacion,
          observacion : true
        }
      };

      if (datos.fechaPlazo) datosDerivacionObservacion.fechaPlazo = FechaHelper.formatearFecha(datos.fechaPlazo);

      await FlujoDerivacionRepository.createOrUpdate(datosDerivacionObservacion, transaccion);

      await transaction.commit(transaccion);
      return true;
    } catch (error) {
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function derivacionNormal (datos = {}) {
    let transaccion;
    try {
      console.log('datossssssssss', datos);
      transaccion =  await transaction.create();

      const { documento, flujoDocumental } = await verificarHojaRutaCite(datos, transaccion);

      const { fileStoragePath } = config.app;
      const outPath = path.resolve(`${fileStoragePath}/documentos/generados/pdf/${documento.id}.pdf`);

      if (!fs.existsSync(outPath)) {
        await ComponenteService.interoperabilidadDerivacion(documento.id, datos.idUsuario, transaccion);
      }

      await evaluarReglasExportacion(documento, flujoDocumental, datos.idUsuario, transaccion);

      datos.tipoFlujo = flujoDocumental.tipo;
      datos.tipoEjecucion = datos.configuracionFinalizacion ? datos.configuracionFinalizacion.tipoFinalizacion : 'DERIVACION';
      datos.idDocumento = documento.id;
      datos.idFlujo = flujoDocumental.id;

      if (datos.clasificacion?.tipo) {
        if (datos.clasificacion.tipo !== flujoDocumental.clasificacion) {
          const historial = flujoDocumental.historialClasificacion;
          historial.push({
            motivo        : datos.clasificacion.motivo,
            idUsuario     : datos.remitente?.id || datos.destinatario?.id,
            usuario       : datos.remitente?.nombre || datos.destinatario?.nombre,
            clasificacion : datos.clasificacion.tipo,
            fecha         : new Date()
          });
          await FlujoDocumentalRepository.createOrUpdate({ id: flujoDocumental.id, clasificacion: datos.clasificacion.tipo, historialClasificacion: historial }, transaccion);
        }
      }

      datos.informacionComplementaria = { remitente: datos.remitente, destinatario: datos.destinatario, descripcion: datos.descripcion };

      const destinatario = documento.configuracionDerivaciones.find(x => x.idUsuario === datos.destinatario.id);
      datos.tipoDerivacion = destinatario.tipo;

      await DerivacionService.derivacionNormal(datos, transaccion);

      const remitenteInicial = documento.configuracionDerivaciones.find(x => x.inicial);
      console.log(`========================================== ES REMITENTE INICIAL:  ${remitenteInicial?.idUsuario === datos.idUsuario}`);
      if (remitenteInicial?.idUsuario === datos.idUsuario && documento.cite) {
        console.log('========================================_REMNITENTE_INICIAL_', `${remitenteInicial.nombreUsuario} `);
        const { fileStoragePath } = config.app;
        const documentoPdf = await DocumentoRepository.findOne({ id: documento.id }, transaccion);
        const folder = `${fileStoragePath}/documentos/temporales`;
        if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder);
        }
        fs.writeFileSync(`${folder}/${documento.id}.json`, JSON.stringify(documentoPdf));
        // await DocumentoService.generarPdf(documento.id, false);
        await DocumentoService.generarPdf(documento.id, false, datos.idUsuario, true);
      }

      await DocumentoRepository.createOrUpdate({ id: documento.id, estado: 'DERIVADO', editable: false }, transaccion);

      const linkRedireccion = documento.cite
        ? await registrarAprobacionCiudadania({ documento, idUsuario: datos.idUsuario, tipo: datos.tipo, token: datos.token }, false, transaccion)
        : null;

      await transaction.commit(transaccion);

      return linkRedireccion;
    } catch (error) {
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message || error, 400);
    }
  }

  async function derivacionArchivar (datos = {}) {
    let transaccion;
    try {
      transaccion =  await transaction.create();

      const FlujoDerivacion = await FlujoDerivacionRepository.findOne({ id: datos.id }, transaccion);
      const { documento: documentoActual } = FlujoDerivacion;
      const solicitudPlantilla = FlujoDerivacion?.flujoDocumental?.solicitudPlantilla || null;

      await ComponenteService.ejecutarInteroperabilidades(documentoActual.id, 'ejecutarArchivar', datos.idUsuario, transaccion);

      const { documento, flujoDocumental } = await verificarHojaRutaCite(datos, transaccion);

      await evaluarReglasExportacion(documento, flujoDocumental, datos.idUsuario, transaccion);

      const datosArchivo = {
        idFlujo                   : flujoDocumental.id,
        idDocumento               : documento.id,
        idCarpeta                 : datos.idCarpeta,
        idPaso                    : datos.idPaso,
        idAccion                  : datos.idAccion,
        descripcion               : datos.descripcion,
        remitente                 : datos.remitente,
        idUsuario                 : datos.idUsuario,
        informacionComplementaria : {
          remitente    : datos.remitente,
          destinatario : { nombreDestinatario: 'ARCHIVADO', tipo: 'DESTINATARIO', descripcion: datos.descripcion }
        }
      };

      await DerivacionService.archivar(datosArchivo, transaccion);

      const remitenteInicial = documento.configuracionDerivaciones.find(x => x.inicial);
      console.log(`========================================== ES REMITENTE INICIAL:  ${remitenteInicial?.idUsuario === datos.idUsuario}`);
      if (remitenteInicial?.idUsuario === datos.idUsuario) {
        console.log('========================================_REMNITENTE_INICIAL_', `${remitenteInicial.nombreUsuario} `);
        const { fileStoragePath } = config.app;
        const documentoPdf = await DocumentoRepository.findOne({ id: documento.id }, transaccion);
        const folder = `${fileStoragePath}/documentos/temporales`;
        if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder);
        }
        fs.writeFileSync(`${folder}/${documento.id}.json`, JSON.stringify(documentoPdf));
        // await DocumentoService.generarPdf(documento.id, false);
        await DocumentoService.generarPdf(documento.id, false, datos.idUsuario, true);
      }

      await DocumentoRepository.createOrUpdate({ id: documento.id, estado: 'CERRADO', editable: false }, transaccion);

      await FlujoDocumentalRepository.createOrUpdate({
        id             : flujoDocumental.id,
        concluido      : true,
        proveidoCierre : datos.descripcion,
        idCarpeta      : datos.idCarpeta,
        estado         : 'ARCHIVADO'
      }, transaccion);

      const linkRedireccion = await registrarAprobacionCiudadania({ documento, idUsuario: datos.idUsuario, tipo: datos.tipo, token: datos.token }, solicitudPlantilla?.docfisico || false, transaccion);

      await transaction.commit(transaccion);

      return linkRedireccion;
    } catch (error) {
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message || error, 400);
    }
  }

  async function derivacionCerrar (datos = {}) {
    let transaccion;
    try {
      transaccion =  await transaction.create();

      const FlujoDerivacion = await FlujoDerivacionRepository.findOne({ id: datos.id }, transaccion);
      const { documento: documentoActual } = FlujoDerivacion;
      const solicitudPlantilla = FlujoDerivacion?.flujoDocumental?.solicitudPlantilla || null;

      await ComponenteService.ejecutarInteroperabilidades(documentoActual.id, 'ejecutarCerrar', datos.idUsuario, transaccion);

      const { documento, flujoDocumental } = await verificarHojaRutaCite(datos, transaccion);

      await evaluarReglasExportacion(documento, flujoDocumental, datos.idUsuario, transaccion);

      const datosArchivo = {
        idFlujo                   : flujoDocumental.id,
        idDocumento               : documento.id,
        idAccion                  : datos.idAccion,
        descripcion               : datos.descripcion,
        remitente                 : datos.remitente,
        idUsuario                 : datos.idUsuario,
        informacionComplementaria : {
          remitente    : datos.remitente,
          destinatario : { nombreDestinatario: 'FINALIZADO', tipo: 'DESTINATARIO', descripcion: datos.descripcion }
        }
      };

      await DerivacionService.cerrar(datosArchivo, transaccion);

      const remitenteInicial = documento.configuracionDerivaciones.find(x => x.inicial);
      console.log(`========================================== ES REMITENTE INICIAL:  ${remitenteInicial?.idUsuario === datos.idUsuario}`);
      if (remitenteInicial?.idUsuario === datos.idUsuario) {
        console.log('========================================_REMNITENTE_INICIAL_', `${remitenteInicial.nombreUsuario} `);
        const { fileStoragePath } = config.app;
        const documentoPdf = await DocumentoRepository.findOne({ id: documento.id }, transaccion);
        const folder = `${fileStoragePath}/documentos/temporales`;
        if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder);
        }
        fs.writeFileSync(`${folder}/${documento.id}.json`, JSON.stringify(documentoPdf));
        // await DocumentoService.generarPdf(documento.id, false);
        await DocumentoService.generarPdf(documento.id, false, datos.idUsuario, true);
      }

      await DocumentoRepository.createOrUpdate({ id: documento.id, estado: 'CERRADO', editable: false }, transaccion);

      await FlujoDocumentalRepository.createOrUpdate({
        id             : flujoDocumental.id,
        concluido      : true,
        proveidoCierre : datos.descripcion,
        estado         : 'FINALIZADO'
      }, transaccion);

      const linkRedireccion = await registrarAprobacionCiudadania({ documento, idUsuario: datos.idUsuario, tipo: datos.tipo, token: datos.token }, solicitudPlantilla?.docfisico || false, transaccion);
      await transaction.commit(transaccion);

      return linkRedireccion;
    } catch (error) {
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message || error, 400);
    }
  }

  async function derivacionProveido (datos = {}) {
    let transaccion;
    try {
      transaccion =  await transaction.create();
      const FlujoDerivacion = await FlujoDerivacionRepository.findOne({ id: datos.id }, transaccion);
      const { documento: documentoActual } = FlujoDerivacion;
      const solicitudPlantilla = FlujoDerivacion?.flujoDocumental?.solicitudPlantilla || null;

      await ComponenteService.ejecutarInteroperabilidades(documentoActual.id, 'ejecutarProveido', datos.idUsuario, transaccion);

      const { documento, flujoDocumental } = await verificarHojaRutaCite(datos, transaccion);

      await evaluarReglasExportacion(documento, flujoDocumental, datos.idUsuario, transaccion);

      const { fileStoragePath } = config.app;
      const outPath = path.resolve(`${fileStoragePath}/documentos/generados/pdf/${documento.id}.pdf`);

      if (!fs.existsSync(outPath)) {
        await ComponenteService.interoperabilidadDerivacion(documento.id, datos.idUsuario, transaccion);
      }

      const datosArchivo = {
        idFlujo                   : flujoDocumental.id,
        idDocumento               : documento.id,
        idDocumentoDestino        : datos.idDocumentoDestino,
        idPaso                    : datos.idPaso,
        idAccion                  : datos.idAccion,
        descripcion               : datos.descripcion,
        remitente                 : datos.remitente,
        destinatario              : datos.destinatario,
        idUsuario                 : datos.idUsuario,
        urgente                   : datos.urgente,
        fechaPlazo                : datos.fechaPlazo,
        informacionComplementaria : {
          remitente    : datos.remitente,
          destinatario : datos.destinatario,
          descripcion  : datos.descripcion
        },
        usuariosCopia: datos.usuariosCopia
      };

      await DerivacionService.derivarProveido(datosArchivo, transaccion);

      const remitenteInicial = documento.configuracionDerivaciones.find(x => x.inicial);
      console.log(`========================================== ES REMITENTE INICIAL:  ${remitenteInicial?.idUsuario === datos.idUsuario}`);
      if (remitenteInicial?.idUsuario === datos.idUsuario || documentoActual.cite !== documento.cite) {
        console.log('========================================_REMNITENTE_INICIAL_', `${remitenteInicial.nombreUsuario} `);
        const { fileStoragePath } = config.app;
        const documentoPdf = await DocumentoRepository.findOne({ id: documento.id }, transaccion);
        const folder = `${fileStoragePath}/documentos/temporales`;
        if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder);
        }
        fs.writeFileSync(`${folder}/${documento.id}.json`, JSON.stringify(documentoPdf));
        // await DocumentoService.generarPdf(documento.id, false);
        await DocumentoService.generarPdf(documento.id, false, datos.idUsuario, true);
      }

      let estadoDocumento = 'CERRADO';
      let editableDocumento = false;
      const tieneCorreccion = await  DocumentoObservacionRepository.findAll({ corregido: false, idDocumento: documento.id });
      if (documento.estado === 'EN CORRECCION' || tieneCorreccion.length > 0) {
        estadoDocumento = 'EN CORRECCION';
        editableDocumento = true;
      }

      await DocumentoRepository.createOrUpdate({ id: documento.id, estado: estadoDocumento, editable: editableDocumento }, transaccion);

      console.log('DATOSSSSS->', datos);

      const linkRedireccion = documento.cite
        ? await registrarAprobacionCiudadania({ documento, idUsuario: datos.idUsuario, tipo: datos.tipo, token: datos.token }, solicitudPlantilla?.docfisico || false, transaccion)
        : null;
      if (documentoActual.cite !== documento.cite && !solicitudPlantilla?.docfisico) {
        const aprobacionActual = await AprobacionDocumentosRepository.findOne({
          idDocumento : documento.id,
          idFlujo     : documento.idFlujo,
          idUsuario   : datos.idUsuario
        });

        let indexUsuarioActual = documentoActual.configuracionDerivaciones.findIndex(x => x.idUsuario === datos.idUsuario);

        if (indexUsuarioActual === -1) indexUsuarioActual = documentoActual.configuracionDerivaciones.length;

        for (let i = 0; i < indexUsuarioActual; i++) {
          const registro = documentoActual.configuracionDerivaciones[i];
          const user = await UsuarioRepository.findOne({ id: registro.idUsuario });
          const existeSolicitud =  await AprobacionDocumentosRepository.findOne({
            idDocumento : documento.id,
            idFlujo     : documento.idFlujo,
            idUsuario   : user.id
          });
          if (!existeSolicitud) {
            await AprobacionDocumentosRepository.createOrUpdate({
              idUsuario             : user.id,
              idFlujo               : documento.idFlujo,
              idDocumento           : documento.id,
              tramite               : null,
              urlRedireccion        : aprobacionActual?.urlRedireccion || 'SIN LINK',
              fechaHoraSolicitud    : aprobacionActual?.fechaHoraSolicitud || moment().format('DD/MM/YYYY HH:mm:ss'),
              hashDatos             : aprobacionActual?.hashDatos || '',
              ci                    : user.numeroDocumento,
              descripcion           : aprobacionActual?.descripcion || documento.asunto,
              nombreArchivo         : `${documento.id}.pdf`,
              urlRedireccionCliente : aprobacionActual?.urlRedireccionCliente || '',
              userCreated           : datos.idUsuario
            }, transaccion);
          }
        }
      }
      await transaction.commit(transaccion);

      return linkRedireccion;
    } catch (error) {
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message || error, 400);
    }
  }

  async function derivacionProveidoObservacion (datos = {}) {
    let transaccion;
    try {
      transaccion =  await transaction.create();
      const { flujoDocumental } = await FlujoDerivacionRepository.findOne({ id: datos.id }, transaccion);

      const datosArchivo = {
        idFlujo                   : flujoDocumental.id,
        idDocumento               : datos.idDocumento,
        idAccion                  : datos.idAccion,
        descripcion               : datos.descripcion,
        remitente                 : datos.remitente,
        destinatario              : datos.destinatario,
        idUsuario                 : datos.idUsuario,
        urgente                   : datos.urgente,
        fechaPlazo                : datos.fechaPlazo,
        informacionComplementaria : {
          observacion  : true,
          remitente    : datos.remitente,
          destinatario : datos.destinatario,
          descripcion  : datos.descripcion
        }
      };

      await ComponenteService.ejecutarInteroperabilidades(datos.idDocumento, 'ejecutarProveidoObservacion', datos.idUsuario, transaccion);

      await DerivacionService.derivacionProveidoObservacion(datosArchivo, transaccion);

      await transaction.commit(transaccion);

      const linkRedireccion = null;

      return linkRedireccion;
    } catch (error) {
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function derivacionCrearDocumento (datos = {}) {
    let transaccion;
    try {
      transaccion =  await transaction.create();

      const FlujoDerivacion = await FlujoDerivacionRepository.findOne({ id: datos.id }, transaccion);
      const { documento: documentoActual } = FlujoDerivacion;
      const solicitudPlantilla = FlujoDerivacion?.flujoDocumental?.solicitudPlantilla || null;
      const documentoFisico = solicitudPlantilla?.docfisico || false;
      const { documento, flujoDocumental } = await verificarHojaRutaCite(datos, transaccion);

      if (datos.clasificacion?.tipo && documentoFisico) {
        if (datos.clasificacion.tipo !== flujoDocumental.clasificacion) {
          const historial = flujoDocumental.historialClasificacion;
          historial.push({
            motivo        : datos.clasificacion.motivo,
            idUsuario     : datos.remitente?.id || datos.destinatario?.id,
            usuario       : datos.remitente?.nombre || datos.destinatario?.nombre,
            clasificacion : datos.clasificacion.tipo,
            fecha         : new Date()
          });
          await FlujoDocumentalRepository.createOrUpdate({ id: flujoDocumental.id, clasificacion: datos.clasificacion.tipo, historialClasificacion: historial }, transaccion);
        }
      }

      await ComponenteService.ejecutarInteroperabilidades(documentoActual.id, 'ejecutarCrearDocumento', datos.idUsuario, transaccion);

      await evaluarReglasExportacion(documento, flujoDocumental, datos.idUsuario, transaccion);

      const { fileStoragePath } = config.app;
      const outPath = path.resolve(`${fileStoragePath}/documentos/generados/pdf/${documento.id}.pdf`);

      if (!fs.existsSync(outPath)) {
        await ComponenteService.interoperabilidadDerivacion(documento.id, datos.idUsuario, transaccion);
      }

      const datosArchivo = {
        idFlujo                   : flujoDocumental.id,
        idDocumento               : documento.id,
        idPlantillaDocumento      : datos.idPlantillaDocumento,
        idAccion                  : datos.idAccion,
        descripcion               : datos.descripcion,
        remitente                 : datos.remitente,
        destinatario              : datos.remitente,
        idUsuario                 : datos.idUsuario,
        informacionComplementaria : {
          remitente    : datos.remitente,
          destinatario : datos.remitente,
          descripcion  : datos.descripcion
        }
      };

      if (documentoFisico) {
        datosArchivo.idPaso = datos.idPaso;
      }

      await DerivacionService.derivarCrearDocumento(datosArchivo, transaccion, documentoFisico);

      const remitenteInicial = documento.configuracionDerivaciones.find(x => x.inicial);
      console.log(`========================================== ES REMITENTE INICIAL:  ${remitenteInicial?.idUsuario === datos.idUsuario}`);
      if (remitenteInicial?.idUsuario === datos.idUsuario || documentoActual.cite !== documento.cite) {
        console.log('========================================_REMNITENTE_INICIAL_', `${remitenteInicial.nombreUsuario} `);
        const { fileStoragePath } = config.app;
        const documentoPdf = await DocumentoRepository.findOne({ id: documento.id }, transaccion);
        const folder = `${fileStoragePath}/documentos/temporales`;
        if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder);
        }
        fs.writeFileSync(`${folder}/${documento.id}.json`, JSON.stringify(documentoPdf));
        // await DocumentoService.generarPdf(documento.id, false);
        await DocumentoService.generarPdf(documento.id, false, datos.idUsuario, true);
      }

      let estadoDocumento = 'CERRADO';
      let editableDocumento = false;
      const tieneCorreccion = await  DocumentoObservacionRepository.findAll({ corregido: false, idDocumento: documento.id });
      if (documento.estado === 'EN CORRECCION' || tieneCorreccion.length > 0) {
        estadoDocumento = 'EN CORRECCION';
        editableDocumento = true;
      }

      await DocumentoRepository.createOrUpdate({ id: documento.id, estado: estadoDocumento, editable: editableDocumento }, transaccion);

      const linkRedireccion = documento.cite
        ? await registrarAprobacionCiudadania({ documento, idUsuario: datos.idUsuario, tipo: datos.tipo, token: datos.token }, documentoFisico, transaccion)
        : null;

      if (documentoActual.cite !== documento.cite && !solicitudPlantilla?.docfisico) {
        const aprobacionActual = await AprobacionDocumentosRepository.findOne({
          idDocumento : documento.id,
          idFlujo     : documento.idFlujo,
          idUsuario   : datos.idUsuario
        });

        let indexUsuarioActual = documentoActual.configuracionDerivaciones.findIndex(x => x.idUsuario === datos.idUsuario);

        if (indexUsuarioActual === -1) indexUsuarioActual = documentoActual.configuracionDerivaciones.length;

        for (let i = 0; i < indexUsuarioActual; i++) {
          const registro = documentoActual.configuracionDerivaciones[i];
          const user = await UsuarioRepository.findOne({ id: registro.idUsuario });
          const existeSolicitud =  await AprobacionDocumentosRepository.findOne({
            idDocumento : documento.id,
            idFlujo     : documento.idFlujo,
            idUsuario   : user.id
          });
          if (!existeSolicitud) {
            await AprobacionDocumentosRepository.createOrUpdate({
              idUsuario             : user.id,
              idFlujo               : documento.idFlujo,
              idDocumento           : documento.id,
              tramite               : null,
              urlRedireccion        : aprobacionActual?.urlRedireccion || 'SIN LINK',
              fechaHoraSolicitud    : aprobacionActual?.fechaHoraSolicitud || moment().format('DD/MM/YYYY HH:mm:ss'),
              hashDatos             : aprobacionActual?.hashDatos || '',
              ci                    : user.numeroDocumento,
              descripcion           : aprobacionActual?.descripcion || documento.asunto,
              nombreArchivo         : `${documento.id}.pdf`,
              urlRedireccionCliente : aprobacionActual?.urlRedireccionCliente || '',
              userCreated           : datos.idUsuario
            }, transaccion);
          }
        }
      }

      await transaction.commit(transaccion);

      return linkRedireccion;
    } catch (error) {
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message || error, 400);
    }
  }

  async function derivacionDerivarDocumento (datos = {}) {
    let transaccion;
    try {
      transaccion = await transaction.create();

      const FlujoDerivacion = await FlujoDerivacionRepository.findOne({ id: datos.id }, transaccion);
      const { documento: documentoActual } = FlujoDerivacion;
      const solicitudPlantilla = FlujoDerivacion?.flujoDocumental?.solicitudPlantilla || null;
      const documentoFisico = solicitudPlantilla?.docfisico || false;

      await ComponenteService.ejecutarInteroperabilidades(documentoActual.id, 'ejecutarDerivarDocumento', datos.idUsuario, transaccion);

      const { documento, flujoDocumental } = await verificarHojaRutaCite(datos, transaccion);

      if (datos.clasificacion?.tipo && documentoFisico) {
        if (datos.clasificacion.tipo !== flujoDocumental.clasificacion) {
          const historial = flujoDocumental.historialClasificacion;
          historial.push({
            motivo        : datos.clasificacion.motivo,
            idUsuario     : datos.remitente?.id || datos.destinatario?.id,
            usuario       : datos.remitente?.nombre || datos.destinatario?.nombre,
            clasificacion : datos.clasificacion.tipo,
            fecha         : new Date()
          });
          await FlujoDocumentalRepository.createOrUpdate({ id: flujoDocumental.id, clasificacion: datos.clasificacion.tipo, historialClasificacion: historial }, transaccion);
        }
      }

      await evaluarReglasExportacion(documento, flujoDocumental, datos.idUsuario, transaccion);

      const { fileStoragePath } = config.app;
      const outPath = path.resolve(`${fileStoragePath}/documentos/generados/pdf/${documento.id}.pdf`);

      if (!fs.existsSync(outPath)) await ComponenteService.interoperabilidadDerivacion(documento.id, datos.idUsuario, transaccion);

      const datosArchivo = {
        idFlujo                   : flujoDocumental.id,
        idDocumento               : documento.id,
        idPaso                    : datos.idPaso,
        idPlantillaDocumento      : datos.idPlantillaDocumento,
        idAccion                  : datos.idAccion,
        descripcion               : datos.descripcion,
        remitente                 : datos.remitente,
        destinatario              : datos.destinatario,
        idUsuario                 : datos.idUsuario,
        informacionComplementaria : {
          remitente    : datos.remitente,
          destinatario : datos.remitente,
          descripcion  : datos.descripcion
        }
      };

      await DerivacionService.derivarNuevoDocumento(datosArchivo, transaccion);

      const remitenteInicial = documento.configuracionDerivaciones.find(x => x.inicial);
      console.log(`========================================== ES REMITENTE INICIAL:  ${remitenteInicial?.idUsuario === datos.idUsuario}`);
      if (remitenteInicial?.idUsuario === datos.idUsuario || documentoActual.cite !== documento.cite) {
        console.log('========================================_REMNITENTE_INICIAL_', `${remitenteInicial.nombreUsuario} `);
        const { fileStoragePath } = config.app;
        const documentoPdf = await DocumentoRepository.findOne({ id: documento.id }, transaccion);
        const folder = `${fileStoragePath}/documentos/temporales`;
        if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder);
        }
        fs.writeFileSync(`${folder}/${documento.id}.json`, JSON.stringify(documentoPdf));
        // await DocumentoService.generarPdf(documento.id, false);
        await DocumentoService.generarPdf(documento.id, false, datos.idUsuario, true);
      }

      let estadoDocumento = 'CERRADO';
      let editableDocumento = false;
      const tieneCorreccion = await  DocumentoObservacionRepository.findAll({ corregido: false, idDocumento: documento.id });
      if (documento.estado === 'EN CORRECCION' || tieneCorreccion.length > 0) {
        estadoDocumento = 'EN CORRECCION';
        editableDocumento = true;
      }

      await DocumentoRepository.createOrUpdate({ id: documento.id, estado: estadoDocumento, editable: editableDocumento }, transaccion);

      const linkRedireccion = documento.cite
        ? await registrarAprobacionCiudadania({ documento, idUsuario: datos.idUsuario, tipo: datos.tipo, token: datos.token }, documentoFisico, transaccion)
        : null;

      if (documentoActual.cite !== documento.cite && !solicitudPlantilla?.docfisico) {
        const aprobacionActual = await AprobacionDocumentosRepository.findOne({
          idDocumento : documento.id,
          idFlujo     : documento.idFlujo,
          idUsuario   : datos.idUsuario
        });

        let indexUsuarioActual = documentoActual.configuracionDerivaciones.findIndex(x => x.idUsuario === datos.idUsuario);

        if (indexUsuarioActual === -1) indexUsuarioActual = documentoActual.configuracionDerivaciones.length;

        for (let i = 0; i < indexUsuarioActual; i++) {
          const registro = documentoActual.configuracionDerivaciones[i];
          const user = await UsuarioRepository.findOne({ id: registro.idUsuario });
          const existeSolicitud =  await AprobacionDocumentosRepository.findOne({
            idDocumento : documento.id,
            idFlujo     : documento.idFlujo,
            idUsuario   : user.id
          });
          if (!existeSolicitud) {
            await AprobacionDocumentosRepository.createOrUpdate({
              idUsuario             : user.id,
              idFlujo               : documento.idFlujo,
              idDocumento           : documento.id,
              tramite               : null,
              urlRedireccion        : aprobacionActual?.urlRedireccion || 'SIN LINK',
              fechaHoraSolicitud    : aprobacionActual?.fechaHoraSolicitud || moment().format('DD/MM/YYYY HH:mm:ss'),
              hashDatos             : aprobacionActual?.hashDatos || '',
              ci                    : user.numeroDocumento,
              descripcion           : aprobacionActual?.descripcion || documento.asunto,
              nombreArchivo         : `${documento.id}.pdf`,
              urlRedireccionCliente : aprobacionActual?.urlRedireccionCliente || '',
              userCreated           : datos.idUsuario
            }, transaccion);
          }
        }
      }

      await transaction.commit(transaccion);

      return linkRedireccion;
    } catch (error) {
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message || error, 400);
    }
  }

  async function observacionPaso (datos = {}) {
    let transaccion;
    try {
      transaccion =  await transaction.create();
      const { flujoDocumental } = await FlujoDerivacionRepository.findOne({ id: datos.id }, transaccion);

      const datosArchivo = {
        idFlujo                   : flujoDocumental.id,
        idDocumento               : datos.idDocumento,
        idPaso                    : datos.idPaso,
        idAccion                  : datos.idAccion,
        descripcion               : datos.descripcion,
        remitente                 : datos.remitente,
        destinatario              : datos.destinatario,
        idUsuario                 : datos.idUsuario,
        urgente                   : datos.urgente,
        fechaPlazo                : datos.fechaPlazo,
        informacionComplementaria : {
          observacion  : true,
          remitente    : datos.remitente,
          destinatario : datos.destinatario,
          descripcion  : datos.descripcion
        }
      };

      await ComponenteService.ejecutarInteroperabilidades(datos.idDocumento, 'ejecutarObservarPaso', datos.idUsuario, transaccion);

      await DerivacionService.observacionPaso(datosArchivo, transaccion);

      await transaction.commit(transaccion);

      const linkRedireccion = null;

      return linkRedireccion;
    } catch (error) {
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function observacionNormal (datos = {}) {
    let transaccion;
    try {
      transaccion =  await transaction.create();
      const { flujoDocumental } = await FlujoDerivacionRepository.findOne({ id: datos.id }, transaccion);

      const datosObservacion = {
        idFlujo                   : flujoDocumental.id,
        idDocumento               : datos.idDocumento,
        idPaso                    : datos.idPaso,
        idAccion                  : datos.idAccion,
        descripcion               : datos.descripcion,
        remitente                 : datos.remitente,
        destinatario              : datos.destinatario,
        idUsuario                 : datos.idUsuario,
        urgente                   : datos.urgente,
        fechaPlazo                : datos.fechaPlazo,
        informacionComplementaria : {
          remitente    : datos.remitente,
          destinatario : datos.destinatario,
          descripcion  : datos.descripcion,
          observacion  : true
        }
      };

      await ComponenteService.ejecutarInteroperabilidades(datos.idDocumento, 'ejecutarObservar', datos.idUsuario, transaccion);

      await DerivacionService.observacionNormal(datosObservacion, transaccion);

      try {
        const { fileStoragePath } = config.app;
        const pdfPath = `${fileStoragePath}/documentos/generados/pdf`;
        const fullPath = path.resolve(`${pdfPath}/${datos.idDocumento}.pdf`);

        if (fs.existsSync(fullPath)) {
          const folder = `${pdfPath}/observados`;
          if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder);
          }
          await fs.promises.rename(fullPath, `${folder}/${datos.idDocumento}.pdf`);
        }
      } catch (error) {
        console.error(error);
      }

      await transaction.commit(transaccion);

      const linkRedireccion = null;

      return linkRedireccion;
    } catch (error) {
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function observacionDesvinculacion (datos = {}) {
    let transaccion;
    try {
      transaccion =  await transaction.create();

      const datosObservacion = {
        idFlujo                   : datos.idFlujo,
        idDocumento               : datos.idDocumento,
        idAccion                  : datos.idAccion,
        descripcion               : datos.descripcion,
        remitente                 : datos.remitente,
        destinatario              : datos.destinatario,
        idUsuario                 : datos.idUsuario,
        urgente                   : datos.urgente,
        fechaPlazo                : datos.fechaPlazo,
        informacionComplementaria : {
          remitente    : datos.remitente,
          destinatario : datos.destinatario,
          descripcion  : datos.descripcion,
          observacion  : true
        }
      };

      await ComponenteService.ejecutarInteroperabilidades(datos.idDocumento, 'ejecutarObservar', datos.idUsuario, transaccion);

      await DerivacionService.observacionNormal(datosObservacion, transaccion);

      await FlujoDocumentalRepository.createOrUpdate({
        id                : datos.idFlujo,
        proveidoCierre    : null,
        fechaFinalizacion : null,
        estado            : 'PENDIENTE',
        idFlujoPadre      : null,
        userUpdated       : datos.idUsuario
      }, transaccion);

      await transaction.commit(transaccion);

      const linkRedireccion = null;

      return linkRedireccion;
    } catch (error) {
      console.log('ERROR OBSERVACION DESVINCULACION', error);

      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function autoRecepcionar (idFlujo, t) {
    let transaccion;
    try {
      transaccion = t || await transaction.create();
      const ultimaDerivacion = await FlujoDerivacionRepository.ultimaDerivacion({ idFlujo: idFlujo, estadoActual: 'ACTIVO' }, ['createdAt', 'DESC']);

      if (ultimaDerivacion && !ultimaDerivacion?.usuarioRemitente) {
        const penultimaDerivacion = await FlujoDerivacionRepository.ultimaDerivacion({ idFlujo: ultimaDerivacion.idFlujo, estadoActual: 'INACTIVO', notId: ultimaDerivacion.id }, ['createdAt', 'DESC'], transaccion);

        if (ultimaDerivacion.idUsuarioDestinatario === penultimaDerivacion.idUsuarioDestinatario && penultimaDerivacion.idUsuarioRemitente === penultimaDerivacion.idUsuarioDestinatario) {
          await recepcionar({
            id             : ultimaDerivacion.id,
            estado         : 'RECIBIDO',
            fechaRecepcion : new Date()
          });
        }
      }

      if (!t) await transaction.commit(transaccion);
      return true;
    } catch (error) {
      if (!t) await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function registrarVinculacion (datos) {
    let transaccion;
    try {
      transaccion =  await transaction.create();
      let flujoPadre = { id: null };

      if (datos.vincular) {
        if (!datos.codigoFlujo) throw new Error('Debe enviar el Codigo de Hoja de Ruta');

        flujoPadre = await FlujoDocumentalRepository.findOne({ codigoFlujo: datos.codigoFlujo }, transaccion);

        if (flujoPadre.estado === 'VINCULADO') throw new Error('Debe enviar el Codigo de Hoja de Ruta');

        if (!flujoPadre || [ESTADO_FLUJO_DOCUMENTAL.CERRADO, ESTADO_FLUJO_DOCUMENTAL.CANCELADO].includes(flujoPadre.estado))  throw new Error('La hoja de ruta a la que quiere vincular, no existe o se encuentra CERRADA o CANCELADA');
      }

      datos.idFlujoPadre = flujoPadre?.id || null;

      await FlujoDocumentalRepository.createOrUpdate({
        id                : datos.id,
        idFlujoPadre      : flujoPadre?.id,
        fechaFinalizacion : datos.fechaFinalizacion,
        proveidoCierre    : datos.proveidoCierre,
        estado            : datos.estado,
        userUpdated       : datos.userUpdated
      }, transaccion);

      const ultimaDerivacion = await FlujoDerivacionRepository.ultimaDerivacion({ idFlujo: datos.id, estadoActual: 'ACTIVO' });

      const documento = await DocumentoRepository.findOne({ id: ultimaDerivacion.idDocumento });

      if (datos.vincular && !documento.flujoDocumental?.solicitudPlantilla?.docfisico) {
        const derivaciones = await documento.configuracionDerivaciones.map(x => ({ idUsuario: x.idUsuario, idCargo: x.idCargo }));

        // Registro de pendientes de firma de los participantes del documento que no firmaron.
        for (const derivacion of derivaciones) {
          const existe = await AprobacionDocumentosRepository.findOne({ idUsuario: derivacion.idUsuario, idDocumento: ultimaDerivacion.idDocumento }, transaccion);

          if (!existe) await generarSolicitudSinValidacion({ documento, idUsuario: derivacion.idUsuario }, transaccion);
        }
      }

      if (!datos.vincular) {
        await AprobacionDocumentosRepository.deleteItemCond({ idDocumento: documento.id, idFlujo: datos.id, aceptado: false, introducido: false });
      }

      await FlujoDerivacionRepository.createOrUpdate({ id: ultimaDerivacion.id, estadoActual: 'INACTIVO', estado: 'DERIVADO', userUpdated: datos.userUpdated }, transaccion);

      await FlujoDerivacionRepository.createOrUpdate({
        idFlujo               : ultimaDerivacion.idFlujo,
        idDocumento           : ultimaDerivacion.idDocumento,
        idUsuarioRemitente    : datos.vincular ? ultimaDerivacion.idUsuarioDestinatario : null,
        nombreRemitente       : datos.vincular ? ultimaDerivacion.nombreDestinatario : 'DESVINCULACION DE LA HOJA DE RUTA',
        cargoRemitente        : datos.vincular ? ultimaDerivacion.cargoDestinatario : null,
        idCargoRemitente      : datos.vincular ? ultimaDerivacion.idCargoDestinatario : null,
        nombreDestinatario    : datos.vincular ? `VINCULADO A ${flujoPadre.codigoFlujo}` : ultimaDerivacion.nombreRemitente,
        cargoDestinatario     : datos.vincular ? null : ultimaDerivacion.cargoRemitente,
        idUsuarioDestinatario : datos.vincular ? null : ultimaDerivacion.idUsuarioRemitente,
        idCargoDestinatario   : datos.vincular ? null : ultimaDerivacion.idCargoRemitente,
        descripcion           : datos.proveidoCierre,
        fechaDerivacion       : new Date(),
        fechaRecepcion        : new Date(),
        tipo                  : datos.vincular ? 'VINCULADO' : 'PROVEIDO',
        estado                : datos.vincular ? 'DERIVADO' : 'RECIBIDO',
        estadoActual          : 'ACTIVO',
        etapa                 : datos.vincular ? 'FIN' : 'INICIO',
        userCreated           : datos.userUpdated
      }, transaccion);

      await transaction.commit(transaccion);
      return true;
    } catch (error) {
      console.log('==========_MENSAJE_A_MOSTRARSE_==========');
      console.error(error);
      console.log('==========_MENSAJE_A_MOSTRARSE_==========');
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function revertirDerivacion  (idFlujo, idUsuario) {
    let transaccion;
    try {
      if (!idFlujo) {
        throw new Error('El documento no tiene un flujo ');
      }
      transaccion = await transaction.create();
      const flujoDerivacionActual = await FlujoDerivacionRepository.findOne({ idFlujo, estado: 'PENDIENTE DE FIRMA' }, transaccion);

      if (!flujoDerivacionActual) throw new Error('El tramite no esta pendiente de firma.');

      await FlujoDerivacionRepository.createOrUpdate({ id: flujoDerivacionActual.id, estado: 'RECIBIDO' }, transaccion);

      if (!flujoDerivacionActual.idFlujo) throw new Error('Error al obtener el flujo de la derivacion.');

      await FlujoDerivacionRepository.eliminarPosteriores({ idFlujo: flujoDerivacionActual.idFlujo, idActual: flujoDerivacionActual.id, fechaCreacion: moment(flujoDerivacionActual.createdAt, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD'), idUsuario }, transaccion);

      await DocumentoRepository.createOrUpdate({ id: flujoDerivacionActual.idDocumento, estado: 'DERIVADO' }, transaccion);

      await transaction.commit(transaccion);
    } catch (error) {
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function registrarDesarchivo (flujoDocumental, { idUsuario, idCargo }, data) {
    try {
      const { rows: [usuarioCargo] } = await UsuarioCargoRepository.findAll({ idUsuario, idCargo });

      if (!usuarioCargo) throw new Error('No se puede recuperar informacion de su usuario o de su cargo.');

      const ultimaDerivacion = await FlujoDerivacionRepository.ultimaDerivacion({ idFlujo: flujoDocumental.id, nombreDestinatario: 'ARCHIVADO' });

      if (!ultimaDerivacion)  throw new Error('No se encuentra la derivacion para desarchivar el flujo documental.');

      await FlujoDerivacionRepository.createOrUpdate({
        id           : ultimaDerivacion.id,
        estadoActual : 'INACTIVO',
        estado       : 'DERIVADO',
        userUpdated  : usuarioCargo.idUsuario
      });

      const nuevaDerivacion = await FlujoDerivacionRepository.createOrUpdate({
        idFlujo               : ultimaDerivacion.idFlujo,
        idDocumento           : ultimaDerivacion.idDocumento,
        idUsuarioRemitente    : null,
        nombreRemitente       : 'DESARCHIVO DE HOJA DE RUTA',
        cargoRemitente        : null,
        nombreDestinatario    : nombreCompleto(usuarioCargo.usuario),
        cargoDestinatario     : usuarioCargo.cargo.descripcion,
        idUsuarioDestinatario : usuarioCargo.idUsuario,
        idCargoDestinatario   : usuarioCargo.idCargo,
        descripcion           : data.proveido,
        fechaDerivacion       : new Date(),
        fechaRecepcion        : new Date(),
        tipo                  : 'PROVEIDO',
        estado                : 'RECIBIDO',
        estadoActual          : 'ACTIVO',
        etapa                 : 'INICIO',
        userCreated           : usuarioCargo.idUsuario
      });
      return nuevaDerivacion;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function update (data) {
    try {
      if (!data.id) {
        throw new Error('Flujo derivacion debe contener el id');
      }
      const flujoDerivacion = await FlujoDerivacionRepository.createOrUpdate(data);
      return flujoDerivacion;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function cantidadDocumentosPorUsuario (params) {
    try {
      const documentos = await FlujoDerivacionRepository.cantidadDocumentosPorUsuario(params);
      return documentos;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function listaDocumentosPorUsuario (params) {
    try {
      const documentos = await FlujoDerivacionRepository.listaDocumentosPorUsuario(params);
      return documentos;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function listaFlujoDocumentalPendientePorUsuario (params) {
    try {
      const documentos = await FlujoDerivacionRepository.listaFlujoDocumentalPendientePorUsuario(params);
      return documentos;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function getPermisosActuales (documento, flujoDerivacion, flujoDocumental, idUsuario, pasoActual = null) {
    const permisos = {
      editable            : false,
      derivable           : false,
      eliminable          : false,
      observable          : false,
      corregible          : false,
      recepcionable       : false,
      compartible         : false,
      cancelable          : false,
      esPropietario       : false,
      puedeCorregir       : false,
      esRemitenteInicial  : false,
      esDestinatarioFinal : false
    };

    const idUsuarioDestinatario = flujoDerivacion?.idUsuarioDestinatario;
    const estadoDerivacion = flujoDerivacion?.estado;
    const estadoDocumento = documento.estado;
    const idUsuarioActual = idUsuario;

    permisos.cancelable = !!pasoActual?.pasosSiguientes?.find(paso => paso.pasoSiguiente.tipo === 'fallo') && idUsuarioActual === idUsuarioDestinatario;

    permisos.editable = documento.editable && idUsuarioActual === idUsuarioDestinatario;

    permisos.compartible = documento.editable && idUsuarioActual === idUsuarioDestinatario;

    permisos.derivable = ((estadoDocumento !== 'CERRADO' && idUsuarioDestinatario === idUsuarioActual) || (['PROVEIDO', 'RECUPERADO', 'RECHAZADO'].includes(flujoDerivacion?.tipo) && idUsuarioDestinatario === idUsuarioActual)) && flujoDerivacion?.estadoActual === 'ACTIVO';

    permisos.eliminable = !flujoDocumental?.codigoFlujo && idUsuarioActual === idUsuarioDestinatario && !documento.cite &&  documento?.plantilla?.tipo === 'GESTION DOCUMENTAL' && !pasoActual?.pasosSiguientes;

    permisos.recepcionable = estadoDerivacion === 'INICIO' && estadoDocumento === 'DERIVADO' && idUsuarioDestinatario === idUsuarioActual;

    permisos.esPropietario = documento.userCreated === idUsuario;

    if (flujoDocumental?.solicitudPlantilla?.docfisico) {
      const tieneCorreccion = await  DocumentoObservacionRepository.findAll({ idUsuarioObservado: idUsuarioDestinatario, corregido: false, idDocumento: documento.id });
      permisos.corregible = ['EN CORRECCION', 'CERRADO'].includes(documento.estado) && tieneCorreccion.count > 0 && permisos.esPropietario;
      permisos.puedeCorregir = documento.createdAt !== flujoDocumental.createdAt || !permisos.esPropietario;
      permisos.editable = documento.editable && (['EN CORRECCION', 'CERRADO', 'BORRADOR', 'DERIVADO'].includes(documento.estado) || tieneCorreccion.count > 0) && permisos.esPropietario;
      permisos.derivable = (documento.estado !== 'EN CORRECCION' || !permisos.esPropietario) && permisos.derivable;
      permisos.compartible = false;
    }

    const derivacionFinal = documento?.configuracionDerivaciones?.find(x => x.final);
    permisos.esDestinatarioFinal =  derivacionFinal?.idUsuario === idUsuarioActual || flujoDerivacion?.tipo === 'PROVEIDO' || (documento.estado === 'CERRADO' && flujoDerivacion?.tipo === 'RECEUPERADO');

    const derivacionInicial = documento?.configuracionDerivaciones?.find(x => x.inicial);
    permisos.esRemitenteInicial =  derivacionInicial?.idUsuario === idUsuarioActual || !documento?.configuracionDerivaciones;

    permisos.observable = (['VIA', 'DESTINATARIO'].includes(flujoDerivacion.tipo) && !['CERRADO'].includes(estadoDocumento) && idUsuarioActual === idUsuarioDestinatario && !permisos.esRemitenteInicial) ||
    (pasoActual?.pasosObservacion?.length > 0 && idUsuarioActual === idUsuarioDestinatario) ||
    (['REMITENTE', 'RECUPERADO'].includes(flujoDerivacion.tipo) && idUsuarioActual === idUsuarioDestinatario && !permisos.esRemitenteInicial)
    ;

    return permisos;
  }

  async function datosDerivacion (idFlujoDerivacion, idUsuario) {
    let transaccion;
    try {
      transaccion = await transaction.create();

      const respuesta = {
        flujoDerivacion : null,
        documento       : null,
        flujoDocumental : null,
        pasoActual      : null,
        accion          : null,
        permisos        : null
      };
      let pasoActual = null;

      const flujoDerivacion = await FlujoDerivacionRepository.findOne({ id: idFlujoDerivacion }, transaccion);
      const documentoFisico = flujoDerivacion.flujoDocumental?.solicitudPlantilla?.docfisico || false;

      respuesta.documento = flujoDerivacion.documento;
      respuesta.flujoDocumental = flujoDerivacion.flujoDocumental;
      respuesta.accion = flujoDerivacion.accion;

      console.log(`INFO DE VISUALIZACION DOCUMENTO: ====>>>
        AND idUsuarioRemitente = ${flujoDerivacion.idUsuarioDestinatario}
        AND nombreRemitente = ${flujoDerivacion.nombreRemitente}
        AND idUsuarioDestinatario = ${flujoDerivacion.idUsuarioDestinatario}
        AND nombreDestinatario = ${flujoDerivacion.nombreDestinatario}
        AND copia = ${flujoDerivacion.flujoDocumental?.copia}
        AND tipoFlujo = ${flujoDerivacion.flujoDocumental?.tipo}
        AND idDerivacion = ${idFlujoDerivacion}
        AND idFlujo = ${flujoDerivacion.flujoDocumental?.id}
        AND idFlujoPadre = ${flujoDerivacion.flujoDocumental?.idFlujoPadre}
        AND idDocumento = ${flujoDerivacion.documento?.id}
        AND idDocumentoPadre = ${flujoDerivacion.documento?.idDocumentoPadre}
        AND estadoActual = ${flujoDerivacion.estadoActual}`);

      const actualizado = Boolean(flujoDerivacion.documento.userUpdated);

      if (flujoDerivacion.flujoDocumental?.tipo === 'SIPFA') {
        respuesta.pasoActual = flujoDerivacion.pasoActual;

        for (const pasoActualIterate of flujoDerivacion?.flujoDocumental?.pasosActuales) {
          pasoActual = await PasoActualRepository.findOne({ id: pasoActualIterate.id }, transaccion);

          const { idFormulario, configuracion } = pasoActual.pasoActual;

          let formularioId = idFormulario;

          if (flujoDerivacion.tipo === 'PROVEIDO' || documentoFisico) formularioId = flujoDerivacion.documento?.plantilla.id;
          const tieneCorreccion = await  DocumentoObservacionRepository.findAll({ idUsuarioObservado: idUsuario, corregido: false, idDocumento: respuesta.documento.id });
          if (tieneCorreccion.count === 0) {
            respuesta.documento = await SolicitudEjecucionService.getDocumentoActual({ idFlujo: flujoDerivacion.flujoDocumental?.id, idFormulario: formularioId, configuracion, idUsuario }, transaccion);
          }

          SolicitudEjecucionService.parsearDerivacion(respuesta.documento?.plantilla?.configuracion_json);

          respuesta.pasoActual = await SolicitudEjecucionService.getConfiguracionPaso(pasoActual.pasoActual, idUsuario, respuesta.flujoDocumental?.id);
        }
      }

      console.log(`=====>>>>> ESTE DOCUMENTO: ${flujoDerivacion.documento.id}, ESTA ACTUALIZADO POR: ${flujoDerivacion.documento.userUpdated}, EJECUTAR IOP INICIO: ${!actualizado}`);

      if (!actualizado) respuesta.documento = await ComponenteService.ejecutarInteroperabilidades(flujoDerivacion.documento.id, 'ejecutarInicio',  idUsuario, transaccion);

      delete flujoDerivacion.documento;
      delete flujoDerivacion.flujoDocumental;
      delete flujoDerivacion.pasoActual;
      delete flujoDerivacion.accion;
      respuesta.flujoDerivacion = flujoDerivacion;

      respuesta.permisos = await getPermisosActuales(respuesta?.documento, respuesta.flujoDerivacion, respuesta.flujoDocumental, idUsuario, pasoActual?.pasoActual);
      respuesta.correcciones = [];
      if (documentoFisico) {
        const paramsObservacion = respuesta.permisos.esPropietario && respuesta.documento.estado === 'EN CORRECCION' ? { idDocumento: respuesta.documento.id, corregido: false } : { idFlujoDocumental: respuesta.flujoDocumental.id };
        const { rows } = await DocumentoObservacionRepository.findAll(paramsObservacion);
        respuesta.correcciones = documentoFisico ? rows : [];
      }
      await transaction.commit(transaccion);
      return respuesta;
    } catch (error) {
      console.error(error);
      await transaction.rollback(transaccion);
      throw new Error(error.message);
    }
  }

  async function reasignacion (datos) {
    let transaccion;
    try {
      transaccion = await transaction.create();

      for (const derivacion of datos.casosReasignar) {
        const flujoDerivacion = await FlujoDerivacionRepository.findOne({
          id                    : derivacion,
          idUsuarioDestinatario : datos.usuarioOrigen.id,
          idCargoDestinatario   : datos.cargoOrigen.id,
          estado                : datos.bandeja === 'entrada' ? 'INICIO' : 'RECIBIDO'
        }, transaccion);

        if (!flujoDerivacion || !flujoDerivacion?.documento) throw new Error('No puede procesarse la solicitud debido a que existen errores en al menos una derivacion.');

        const documentoFisico = flujoDerivacion.flujoDocumental?.solicitudPlantilla?.docfisico || false;

        await FlujoDerivacionRepository.createOrUpdate({
          id           : flujoDerivacion.id,
          estado       : 'DERIVADO',
          estadoActual : 'INACTIVO'
        }, transaccion);

        const datosNuevaDerivacion = {
          idFlujo                   : flujoDerivacion.idFlujo,
          idPaso                    : flujoDerivacion.idPaso,
          idDocumento               : flujoDerivacion.idDocumento,
          idUsuarioRemitente        : null,
          nombreRemitente           : 'REASIGNACION DE HOJA DE RUTA',
          idCargoRemitente          : null,
          cargoRemitente            : null,
          idUsuarioDestinatario     : datos.usuarioDestino.id,
          nombreDestinatario        : datos.usuarioDestino.nombreCompleto,
          idCargoDestinatario       : datos.cargoDestino.id,
          cargoDestinatario         : datos.cargoDestino.nombre,
          idAccion                  : null,
          descripcion               : 'Reasignacion de hoja de ruta.',
          fechaRecepcion            : null,
          fechaDerivacion           : new Date(),
          observacion               : false,
          tipo                      : 'PROVEIDO',
          estado                    : 'INICIO',
          estadoActual              : 'ACTIVO',
          etapa                     : 'FIN',
          userCreated               : datos.userUpdated,
          urgente                   : true,
          fechaPlazo                : null,
          informacionComplementaria : {},
          esObservable              : true
        };

        if ([ESTADO_DOCUMENTO.DERIVADO, ESTADO_DOCUMENTO.OBSERVADO].includes(flujoDerivacion.documento?.estado) || documentoFisico) {
          let documentoOriginal = flujoDerivacion.documento;

          const respuesta = await DerivacionService.reemplazarRemitente(documentoOriginal, { id: datos.usuarioDestino.id, idCargo: datos.cargoDestino.id }, transaccion);

          documentoOriginal = respuesta.documento;

          const idDocumentoOriginal = documentoOriginal.id;

          documentoOriginal.estado = documentoFisico ? 'CERRADO' : 'DERIVADO';
          documentoOriginal.editable = true;
          documentoOriginal.fechaDocumento = FechaHelper.formatearFecha(documentoOriginal.fechaDocumento);
          documentoOriginal.idDocumentoPadre = documentoOriginal.id;
          documentoOriginal.userCreated = documentoFisico ? datos.usuarioDestino.id : datos.userUpdated;
          documentoOriginal.fechaCerrado = null;

          delete documentoOriginal.configuracionFinalizacion;
          delete documentoOriginal.id;
          delete documentoOriginal.createdAt;
          delete documentoOriginal.updatedAt;

          if (documentoOriginal.pathDocumentoFirma) {
            delete documentoOriginal.pathDocumentoFirma;
          }

          const nuevoDocumento = await DocumentoRepository.createOrUpdate(documentoOriginal, transaccion);

          await DerivacionService.clonarAdjuntosReferencias(idDocumentoOriginal, nuevoDocumento.id, transaccion);

          await DocumentoRepository.createOrUpdate({ id: idDocumentoOriginal, estado: 'OBSERVADO', editable: false }, transaccion);

          datosNuevaDerivacion.observacion = true;
          datosNuevaDerivacion.tipo = 'REMITENTE';
          datosNuevaDerivacion.etapa = 'INICIO';
          datosNuevaDerivacion.idDocumento = nuevoDocumento.id;
        }

        await FlujoDerivacionRepository.createOrUpdate(datosNuevaDerivacion, transaccion);
      }

      await transaction.commit(transaccion);

      return null;
    } catch (error) {
      console.error(error);
      await transaction.rollback(transaccion);
      throw new Error(error.message);
    }
  }

  async function deleteItem (id, userDeleted) {
    try {
      const resultado = await FlujoDerivacionRepository.deleteItemCond({ id, userDeleted });
      return resultado;
    } catch (err) {
      debug(err);
      throw new ErrorApp(err.message, 400);
    }
  }

  async function modificarDerivacion (datos) {
    let transaccion;
    const { fileStoragePath, pdfReciclados } = config.app;

    try {
      transaccion = await transaction.create();

      await DocumentoRepository.createOrUpdate({ id: datos.idDocumento, editable: datos.documentoEditable, estado: datos.estadoDocumento, userUpdated: datos.userUpdated }, transaccion);
      if (datos.documentoEditable) {
        // MOVEL EL PDF DE SU LUGAR A PDF_RECICLADOS
        const origen = `${fileStoragePath}/documentos/generados/pdf/${datos.idDocumento}.pdf`;
        const destino = `${pdfReciclados}/${datos.idDocumento}.pdf`;
        console.log(`MOVIENDO DE: ${origen} A ${destino}`);

        if (fs.existsSync(origen)) fs.renameSync(origen, destino);
      }

      if (datos.idPaso) {
        await PasoActualRepository.deleteItemCond({ idFlujoDocumental: datos.idFlujo, userDeleted: datos.userUpdated }, transaccion);
        await PasoActualRepository.createOrUpdate({ idFlujoDocumental: datos.idFlujo, idPaso: datos.idPaso, userCreated: datos.userUpdated }, transaccion);
      }

      datos.idUsuarioRemitente = datos.remitente?.idUsuario || null;
      datos.idCargoRemitente = datos.remitente?.idCargo || null;
      datos.nombreRemitente = datos.remitente?.nombre || null;
      datos.cargoRemitente = datos.remitente?.cargo || null;

      datos.idUsuarioDestinatario = datos.destinatario?.idUsuario || null;
      datos.idCargoDestinatario = datos.destinatario?.idCargo || null;
      datos.nombreDestinatario = datos.destinatario?.nombre || null;
      datos.cargoDestinatario = datos.destinatario?.cargo || null;

      const resultado = await FlujoDerivacionRepository.createOrUpdate(datos, transaccion);
      await transaction.commit(transaccion);
      return resultado;
    } catch (error) {
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function limitePendientes (params) {
    try {
      if (params) {
        params.firma = true;
      }
      const datos = {
        limiteExedido     : false,
        cantidadPermitida : 0,
        cantidadPendiente : 0
      };
      try {
        checkCiudadaniaStatus(true);
        const estadoIOP = await ParametroRepository.findOne({ grupo: 'CONFIG-IOP', codigo: 'IOP' });
        const documentos = await FlujoDerivacionRepository.cantidades(params);
        const limit = parseInt(config.app.limiteFirmasPendientes);
        if (limit && estadoIOP.estado === 'ACTIVO') {
          datos.cantidadPendiente = parseInt(documentos.firma);
          datos.limiteExedido = datos.cantidadPendiente >= limit;
          datos.cantidadPermitida = limit;
        }
      } catch (error) {
        console.error('ERROR => ', error);
      }
      return datos;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  return {
    modificarDerivacion,
    deleteItem,
    reasignacion,
    observacionNormal,
    observacionDesvinculacion,
    observacionPaso,
    derivacionDerivarDocumento,
    derivacionProveidoObservacion,
    derivacionCrearDocumento,
    derivacionProveido,
    derivacionCerrar,
    derivacionArchivar,
    derivacionNormal,
    listarPendientesFirma,
    datosDerivacion,
    findOne,
    revertirDerivacion,
    autoRecepcionar,
    observar,
    recepcionar,
    listar,
    cantidades,
    registrarVinculacion,
    registrarDesarchivo,
    update,
    cantidadDocumentosPorUsuario,
    listaDocumentosPorUsuario,
    listaFlujoDocumentalPendientePorUsuario,
    limitePendientes
  };
};
