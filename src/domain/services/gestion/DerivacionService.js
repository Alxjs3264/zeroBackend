const debug = require('debug')('app:service:FlujoDerivacion');
const { ErrorApp } = require('../../lib/error');
const validate = require('validate.js');
const fs = require('fs');
const { config } = require('../../../common');
const path = require('path');
const { constants } = require('../../../common/config');

module.exports = function derivacionService (repositories, helpers, res) {
  const { FechaHelper } = helpers;

  const {
    FlujoDerivacionRepository, DocumentoRepository,
    FormularioRepository,
    ArchivoAdjuntoRepository,
    ReferenciaDocumentoRepository,
    DocumentoCompartidoRepository,
    transaction,
    PasoActualRepository,
    FlujoDocumentalRepository,
    AprobacionDocumentosRepository,
    PasoRepository,
    EntidadFlujoDocumentalRepository,
    UsuarioCargoRepository,
    UsuarioRepository
  } = repositories;

  async function registrarInteraccionEntidad (idUsuario, idFlujoDocumental, t = null) {
    const transaccion = t || await transaction.create();

    if (idUsuario) {
      const usuario = await UsuarioRepository.findOne({ id: idUsuario });

      if (!usuario) throw new Error('No se pudo registrar la interaccion de la Hoja de ruta.');

      const { idEntidad } = usuario;

      const existeInteraccion = await EntidadFlujoDocumentalRepository.findOne({ idEntidad, idFlujoDocumental });

      if (!existeInteraccion) await EntidadFlujoDocumentalRepository.createOrUpdate({ idEntidad, idFlujoDocumental, userCreated: idUsuario }, t);
    }
    if (!t) await transaction.commit(transaccion);
  }

  async function reemplazarRemitente (documento, nuevoRemitente = null, t) {
    let transaccion;
    try {
      transaccion = t || await transaction.create();
      const remitenteOriginal = documento.configuracionDerivaciones?.find(x => x.inicial);

      const { rows } = await UsuarioCargoRepository.findAll({ idUsuario: nuevoRemitente.id, idCargo: nuevoRemitente.idCargo, estado: 'ACTIVO' }, transaccion);

      if (!rows[0]) throw new Error('Ocurrio un error al buscar al usuario para observar.');

      const usuarioNuevo = rows[0];

      if (!remitenteOriginal) {
        return {
          documento,
          destinatario: {
            id      : usuarioNuevo.idUsuario,
            nombre  : `${usuarioNuevo.usuario.nombres} ${usuarioNuevo.usuario.primerApellido} ${usuarioNuevo.usuario.segundoApellido}`,
            idCargo : usuarioNuevo.idCargo,
            cargo   : usuarioNuevo.cargo.descripcion
          }
        };
      }

      if (remitenteOriginal.idUsuario === usuarioNuevo.idUsuario && remitenteOriginal.idCargo === usuarioNuevo.idCargo) {
        return {
          documento,
          destinatario: {
            id      : remitenteOriginal.idUsuario,
            nombre  : remitenteOriginal.nombreUsuario,
            idCargo : remitenteOriginal.idCargo,
            cargo   : remitenteOriginal.nombreCargo
          }
        };
      };

      // console.log('==========_DESDE_OBSERVACION INACTIVO_==========');
      // console.log(usuarioNuevo, remitenteOriginal);

      for (const configuracion  of documento.plantilla.configuracion_json) {
        if (configuracion.typeInput === 'derivacion') {
          if (Array.isArray(configuracion.value.valores.de)) {
            for (const de of configuracion.value.valores.de) {
              if (de.idUsuario === remitenteOriginal.idUsuario && de.idCargo === remitenteOriginal.idCargo) {
                de.id = usuarioNuevo.id;
                de.idUsuario = usuarioNuevo.idUsuario;
                de.usuario = usuarioNuevo.usuario;
                de.idCargo = usuarioNuevo.idCargo;
                de.cargo = usuarioNuevo.cargo;
                de.estado = usuarioNuevo.estado;
                de.seleccionadoAutomatico = true;
                de.seleccionado = true;
                de.visiblePdf = true;
              }
            }
          } else {
            configuracion.value.valores.de = usuarioNuevo;
            configuracion.value.valores.de.seleccionadoAutomatico = true;
            configuracion.value.valores.de.seleccionado = true;
            configuracion.value.valores.de.visiblePdf = true;
          }
        }
      }

      for (const configuracion  of documento.configuracionDerivaciones) {
        if (configuracion.inicial) {
          configuracion.idConfiguracionCargo = usuarioNuevo.id;
          configuracion.idCargo = usuarioNuevo.idCargo;
          configuracion.nombreCargo = usuarioNuevo.cargo.descripcion;
          configuracion.idUsuario = usuarioNuevo.idUsuario;
          configuracion.nombreUsuario = `${usuarioNuevo.usuario.nombres} ${usuarioNuevo.usuario.primerApellido} ${usuarioNuevo.usuario.segundoApellido}`;
        }
      }

      if (!t) await transaction.commit(transaccion);

      return {
        documento,
        destinatario: {
          id      : usuarioNuevo.idUsuario,
          nombre  : `${usuarioNuevo.usuario.nombres} ${usuarioNuevo.usuario.primerApellido} ${usuarioNuevo.usuario.segundoApellido}`,
          idCargo : usuarioNuevo.idCargo,
          cargo   : usuarioNuevo.cargo.descripcion
        }
      };
    } catch (error) {
      if (!t) await transaction.rollback(transaccion);
      throw new Error(error.message);
    }
  }

  async function crearCopiaFlujoDocumentoDerivacion (flujo, documento, derivacion, usuarioCopia, nroCopia, t) {
    let transaccion;
    try {
      transaccion = t || await transaction.create();

      const nuevoflujo = await FlujoDocumentalRepository.createOrUpdate({
        idSolicitudPlantilla   : flujo.idSolicitudPlantilla,
        idPasoActual           : null,
        codigoFlujo            : `${flujo.codigoFlujo}-${nroCopia}`,
        numeroHr               : `${flujo.numeroHr}-${nroCopia}`,
        tipo                   : 'GESTION',
        tipoFlujo              : flujo.tipoFlujo,
        idFlujoPadre           : flujo.id,
        estado                 : 'PENDIENTE',
        clasificacion          : flujo.clasificacion,
        historialClasificacion : [],
        concluido              : false,
        idCarpeta              : null,
        proveidoCierre         : '',
        areaRemitente          : '',
        remitente              : derivacion.nombreRemitente,
        cargoRemitente         : derivacion.cargoRemitente,
        areaDestino            : '',
        areaDestinoId          : null,
        referencia             : derivacion.descripcion,
        migrado                : false,
        userCreated            : derivacion.idUsuarioRemitente,
        copia                  : true
      }, transaccion);

      const nuevoDocumento = await DocumentoRepository.createOrUpdate({
        idFlujo                   : nuevoflujo.id,
        idDocumentoPadre          : documento.id,
        hojaRuta                  : flujo.codigoFlujo,
        configuracionDerivaciones : documento.configuracionDerivaciones,
        cite                      : documento.cite,
        asunto                    : documento.asunto,
        plantilla                 : documento.plantilla,
        plantillaValor            : documento.plantillaValor,
        clasificacion             : documento.clasificacion,
        firmado                   : documento.firmado,
        referenciaDocumento       : documento.referenciaDocumento,
        configuracionFinalizacion : documento.configuracionFinalizacion,
        fechaDocumento            : FechaHelper.formatearFecha(documento.fechaDocumento),
        fechaCerrado              : new Date(),
        estado                    : 'CERRADO',
        nombrePdf                 : documento.nombrePdf,
        linkFirma                 : documento.linkFirma,
        editable                  : false,
        compartido                : false,
        idDocumentoOriginal       : documento.id,
        userCreated               : derivacion.idUsuarioRemitente
      }, transaccion);

      await FlujoDerivacionRepository.createOrUpdate({
        idFlujo                   : nuevoflujo.id,
        idDocumento               : nuevoDocumento.id,
        idAccion                  : derivacion.idAccion,
        idPaso                    : derivacion.idPaso,
        idUsuarioRemitente        : derivacion.idUsuarioRemitente,
        nombreRemitente           : derivacion.nombreRemitente,
        idCargoRemitente          : derivacion.idCargoRemitente,
        cargoRemitente            : derivacion.cargoRemitente,
        idUsuarioDestinatario     : usuarioCopia.id,
        nombreDestinatario        : usuarioCopia.nombre,
        cargoDestinatario         : usuarioCopia.cargo,
        idCargoDestinatario       : usuarioCopia.idCargo,
        descripcion               : derivacion.descripcion,
        urgente                   : derivacion.urgente,
        fechaPlazo                : derivacion.fechaPlazo,
        fechaDerivacion           : new Date(),
        tipo                      : 'PROVEIDO',
        estadoActual              : 'ACTIVO',
        estado                    : 'INICIO',
        etapa                     : 'PROCESO',
        userCreated               : derivacion.idUsuarioRemitente,
        informacionComplementaria : derivacion.informacionComplementaria
      }, transaccion);

      if (!t) await transaction.commit(transaccion);
    } catch (error) {
      debug('ERROR EN CREAR NUEVA DERIVACION', error);
      if (!t) await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function derivarProveido (datos, t) {
    let transaccion;
    let nuevaDerivacion;
    try {
      transaccion = t || await transaction.create();

      nuevaDerivacion = await FlujoDerivacionRepository.inactivarRegistros(datos.idFlujo, transaccion);

      await registrarInteraccionEntidad(datos.remitente.id, datos.idFlujo, transaccion);
      await registrarInteraccionEntidad(datos.destinatario?.id, datos.idFlujo, transaccion);

      const datosSiguienteDerivacion = {
        idFlujo                   : datos.idFlujo,
        idDocumento               : datos.idDocumentoDestino || datos.idDocumento,
        idAccion                  : datos.idAccion,
        idPaso                    : datos.idPaso,
        idUsuarioRemitente        : datos.remitente.id,
        nombreRemitente           : datos.remitente.nombre,
        idCargoRemitente          : datos.remitente.idCargo,
        cargoRemitente            : datos.remitente.cargo,
        idUsuarioDestinatario     : datos.destinatario.id,
        nombreDestinatario        : datos.destinatario.nombre,
        cargoDestinatario         : datos.destinatario.cargo,
        idCargoDestinatario       : datos.destinatario.idCargo,
        descripcion               : datos.descripcion,
        urgente                   : datos.urgente,
        fechaPlazo                : datos.fechaPlazo,
        fechaDerivacion           : new Date(),
        tipo                      : 'PROVEIDO',
        estadoActual              : 'ACTIVO',
        estado                    : 'INICIO',
        etapa                     : 'FIN',
        userCreated               : datos.idUsuario,
        informacionComplementaria : datos.informacionComplementaria
      };

      if (datos.usuariosCopia) {
        const flujoOriginal = await FlujoDocumentalRepository.findOne({ id: datos.idFlujo }, {}, transaccion);
        const documentoOriginal = await DocumentoRepository.findOne({ id: datos.idDocumento }, transaccion);

        const cantidadCopiasOriginal = await FlujoDocumentalRepository.getCantidadCopias({ idFlujoPadre: datos.idFlujo, copia: true }, transaccion);

        for (let index = 0; index < datos.usuariosCopia.length; index++) {
          await registrarInteraccionEntidad(datos.usuariosCopia[index].id, datos.idFlujo, transaccion);
          await crearCopiaFlujoDocumentoDerivacion(flujoOriginal, documentoOriginal, datosSiguienteDerivacion, datos.usuariosCopia[index], cantidadCopiasOriginal + index + 1,  transaccion);
        }
      }

      nuevaDerivacion = await FlujoDerivacionRepository.createOrUpdate(datosSiguienteDerivacion, transaccion);

      if (datos.idPaso) {
        await PasoActualRepository.deleteItemCond({ idFlujoDocumental: datos.idFlujo, userDeleted: datos.idUsuario }, transaccion);
        await PasoActualRepository.createOrUpdate({ idFlujoDocumental: datos.idFlujo, idPaso: datos.idPaso, userCreated: datos.idUsuario }, transaccion);

        const paso = await PasoRepository.findOne({ id: datos.idPaso });

        if (paso.tipo === constants.TIPO_PASO.FIN) {
          console.log('DATOSSSSSSSSSSSS', datos);
          await FlujoDocumentalRepository.createOrUpdate({
            id          : datos.idFlujo,
            concluido   : true,
            estado      : constants.ESTADO_FLUJO_DOCUMENTAL.FINALIZADO,
            userUpdated : datos.idUsuario
          }, transaccion);
        }
      }

      if (!t) await transaction.commit(transaccion);

      return nuevaDerivacion;
    } catch (error) {
      if (!t) await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function derivarCrearDocumento (datos, t, documentoFisico = false) {
    let transaccion;
    let nuevaDerivacion;
    try {
      transaccion = t || await transaction.create();

      nuevaDerivacion = await FlujoDerivacionRepository.inactivarRegistros(datos.idFlujo, transaccion);

      const plantilla = await FormularioRepository.findOne({ id: datos.idPlantillaDocumento }, t);

      if (!plantilla) throw new Error('No se encuentra el formulario para derivar.');

      await registrarInteraccionEntidad(datos.remitente.id, datos.idFlujo, transaccion);
      await registrarInteraccionEntidad(datos.destinatario?.id, datos.idFlujo, transaccion);

      const datosSiguienteDerivacion = {
        idFlujo                   : datos.idFlujo,
        idDocumento               : datos.idDocumento,
        idAccion                  : datos.idAccion,
        idPaso                    : datos.idPaso,
        observacion               : datos.observacion,
        descripcion               : datos.descripcion,
        idUsuarioRemitente        : datos.remitente.id,
        nombreRemitente           : datos.remitente.nombre,
        idCargoRemitente          : datos.remitente.idCargo,
        cargoRemitente            : datos.remitente.cargo,
        idUsuarioDestinatario     : datos.destinatario.id,
        nombreDestinatario        : datos.destinatario.nombre,
        idCargoDestinatario       : datos.destinatario.idCargo,
        cargoDestinatario         : datos.destinatario.cargo,
        tipo                      : 'REMITENTE',
        urgente                   : datos.urgente,
        fechaPlazo                : datos.fechaPlazo,
        fechaDerivacion           : new Date(),
        estadoActual              : 'INACTIVO',
        estado                    : 'DERIVADO',
        etapa                     : 'INICIO',
        userCreated               : datos.idUsuario,
        informacionComplementaria : datos.informacionComplementaria
      };

      let paso = null;

      for (const element of plantilla.configuracion_json) {
        element.value = { type: element.type, name: element.name, valores: element.value || element.defaultValue || '' };
      }

      const flujoDocumental = await FlujoDocumentalRepository.findOne({ id: datos.idFlujo }, {}, transaccion);

      if (!flujoDocumental) throw new Error('La hoja de ruta no pudo ser encontrada.');

      if (documentoFisico) {
        paso = await PasoRepository.findOne({ id: datos.idPaso }, transaccion);
        if (!paso)  throw new Error('No existe el paso al que se requiere derivar.');
      }

      const documento = await DocumentoRepository.createOrUpdate({
        idFlujo        : flujoDocumental.id,
        estado         : 'DERIVADO',
        asunto         : plantilla.nombre,
        plantillaValor : [],
        plantilla      : plantilla,
        hojaRuta       : flujoDocumental.codigoFlujo,
        userCreated    : datos.destinatario.id
      }, transaccion);

      nuevaDerivacion = await FlujoDerivacionRepository.createOrUpdate(datosSiguienteDerivacion, transaccion);

      datos.informacionComplementaria.idRecepcionar = nuevaDerivacion.id;

      const datosSiguienteDerivacionDocumento = {
        idFlujo                   : datos.idFlujo,
        idDocumento               : documento.id,
        idAccion                  : datos.idAccion,
        idPaso                    : datos.idPaso,
        observacion               : datos.observacion,
        descripcion               : datos.descripcion,
        idUsuarioDestinatario     : datos.destinatario.id,
        nombreDestinatario        : datos.destinatario.nombre,
        idCargoDestinatario       : datos.destinatario.idCargo,
        cargoDestinatario         : datos.destinatario.cargo,
        tipo                      : 'REMITENTE',
        etapa                     : 'INICIO',
        urgente                   : datos.urgente,
        fechaPlazo                : datos.fechaPlazo,
        fechaDerivacion           : new Date(),
        estadoActual              : 'ACTIVO',
        estado                    : 'INICIO',
        userCreated               : datos.idUsuario,
        informacionComplementaria : datos.informacionComplementaria
      };

      nuevaDerivacion = await FlujoDerivacionRepository.createOrUpdate(datosSiguienteDerivacionDocumento, transaccion);

      if (paso) {
        await PasoActualRepository.deleteItemCond({ idFlujoDocumental: datos.idFlujo, userDeleted: datos.idUsuario }, transaccion);
        await PasoActualRepository.createOrUpdate({ idFlujoDocumental: datos.idFlujo, idPaso: datos.idPaso, userCreated: datos.idUsuario }, transaccion);
      }

      if (!t) await transaction.commit(transaccion);
      return nuevaDerivacion;
    } catch (error) {
      console.log('ERROR EN CREAR NUEVA DERIVACION', error);
      if (!t) await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function derivarNuevoDocumento (datos, t) {
    let transaccion;
    let nuevaDerivacion;
    try {
      transaccion = t || await transaction.create();

      nuevaDerivacion = await FlujoDerivacionRepository.inactivarRegistros(datos.idFlujo, transaccion);

      const plantilla = await FormularioRepository.findOne({ id: datos.idPlantillaDocumento }, transaccion);

      if (!plantilla) throw new Error('No se encuentra el formulario para derivar.');

      const flujoDocumental = await FlujoDocumentalRepository.findOne({ id: datos.idFlujo }, {}, transaccion);

      if (!flujoDocumental) throw new Error('La hoja de ruta no pudo ser encontrada.');

      await registrarInteraccionEntidad(datos.remitente.id, datos.idFlujo, transaccion);
      await registrarInteraccionEntidad(datos.destinatario?.id, datos.idFlujo, transaccion);

      const datosSiguienteDerivacion = {
        idFlujo                   : datos.idFlujo,
        idDocumento               : datos.idDocumento,
        idAccion                  : datos.idAccion,
        idPaso                    : datos.idPaso,
        observacion               : datos.observacion,
        descripcion               : datos.descripcion,
        idUsuarioRemitente        : datos.remitente.id,
        nombreRemitente           : datos.remitente.nombre,
        idCargoRemitente          : datos.remitente.idCargo,
        cargoRemitente            : datos.remitente.cargo,
        idUsuarioDestinatario     : datos.destinatario.id,
        nombreDestinatario        : datos.destinatario.nombre,
        idCargoDestinatario       : datos.destinatario.idCargo,
        cargoDestinatario         : datos.destinatario.cargo,
        tipo                      : 'REMITENTE',
        urgente                   : datos.urgente,
        fechaPlazo                : datos.fechaPlazo,
        fechaDerivacion           : new Date(),
        estadoActual              : 'INACTIVO',
        estado                    : 'DERIVADO',
        etapa                     : 'INICIO',
        userCreated               : datos.idUsuario,
        informacionComplementaria : datos.informacionComplementaria
      };

      const paso = await PasoRepository.findOne({ id: datos.idPaso }, transaccion);

      if (!paso)  throw new Error('No existe el paso al que se requiere derivar.');

      const documentoActual = await DocumentoRepository.findOne({ id: datos.idDocumento }, transaccion);

      if (!documentoActual) throw new Error('Ocurrio un error al intentar obtener el documento actual.');

      let documento = null;

      let documentoOriginal = null;

      if (paso.recuperarDocumento  && documentoActual.idDocumentoPadre) {
        documentoOriginal = await DocumentoRepository.findOne({ idFlujo: datos.idFlujo, plantilla: { id: paso.idFormulario }  }, transaccion);
      }

      if (documentoOriginal) {
        const idDocumentoOriginal = documentoOriginal.id;

        documentoOriginal.estado = 'DERIVADO';
        documentoOriginal.editable = true;
        documentoOriginal.fechaDocumento = FechaHelper.formatearFecha(documentoOriginal.fechaDocumento);
        documentoOriginal.idDocumentoPadre = documentoOriginal.id;

        delete documentoOriginal.configuracionFinalizacion;
        delete documentoOriginal.id;

        if (documentoOriginal.pathDocumentoFirma) {
          delete documentoOriginal.pathDocumentoFirma;
        }

        documento = await DocumentoRepository.createOrUpdate(documentoOriginal, transaccion);

        await clonarAdjuntosReferencias(datos.idDocumento, documento.id, transaccion);

        await DocumentoRepository.createOrUpdate({ id: idDocumentoOriginal, estado: 'OBSERVADO', editable: false }, transaccion);
        await AprobacionDocumentosRepository.deleteItemCond({ idFlujo: datos.idFlujo, idDocumento: idDocumentoOriginal }, transaccion);
      } else {
        for (const element of plantilla.configuracion_json) {
          element.value = { type: element.type, name: element.name, valores: element.value || element.defaultValue || '' };
        }

        documento = await DocumentoRepository.createOrUpdate({
          idFlujo        : flujoDocumental.id,
          hojaRuta       : flujoDocumental.codigoFlujo,
          asunto         : plantilla.nombre,
          plantilla      : plantilla,
          estado         : 'DERIVADO',
          plantillaValor : [],
          userCreated    : datos.destinatario.id
        }, transaccion);
      }

      nuevaDerivacion = await FlujoDerivacionRepository.createOrUpdate(datosSiguienteDerivacion, transaccion);

      datos.informacionComplementaria.idRecepcionar = nuevaDerivacion.id;

      const datosSiguienteDerivacionDocumento = {
        idFlujo                   : datos.idFlujo,
        idDocumento               : documento.id,
        idAccion                  : datos.idAccion,
        idPaso                    : datos.idPaso,
        observacion               : datos.observacion,
        descripcion               : datos.descripcion,
        idUsuarioDestinatario     : datos.destinatario.id,
        nombreDestinatario        : datos.destinatario.nombre,
        idCargoDestinatario       : datos.destinatario.idCargo,
        cargoDestinatario         : datos.destinatario.cargo,
        tipo                      : 'REMITENTE',
        etapa                     : 'INICIO',
        urgente                   : datos.urgente,
        fechaPlazo                : datos.fechaPlazo,
        fechaDerivacion           : new Date(),
        estadoActual              : 'ACTIVO',
        estado                    : 'INICIO',
        userCreated               : datos.idUsuario,
        informacionComplementaria : datos.informacionComplementaria
      };

      nuevaDerivacion = await FlujoDerivacionRepository.createOrUpdate(datosSiguienteDerivacionDocumento, transaccion);

      if (datos.idPaso) {
        await PasoActualRepository.deleteItemCond({ idFlujoDocumental: datos.idFlujo, userDeleted: datos.idUsuario }, transaccion);
        await PasoActualRepository.createOrUpdate({ idFlujoDocumental: datos.idFlujo, idPaso: datos.idPaso, userCreated: datos.idUsuario }, transaccion);
      }

      if (!t) await transaction.commit(transaccion);
      return nuevaDerivacion;
    } catch (error) {
      console.log('ERROR EN CREAR NUEVA DERIVACION', error);
      if (!t) await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function derivacionNormal (datos, t) {
    let transaccion;
    let nuevaDerivacion;
    try {
      transaccion = t || await transaction.create();

      nuevaDerivacion = await FlujoDerivacionRepository.inactivarRegistros(datos.idFlujo, transaccion);

      await registrarInteraccionEntidad(datos.remitente.id, datos.idFlujo, transaccion);
      await registrarInteraccionEntidad(datos.destinatario?.id, datos.idFlujo, transaccion);

      const datosSiguienteDerivacion = {
        idFlujo                   : datos.idFlujo,
        idDocumento               : datos.idDocumento,
        idAccion                  : datos.idAccion,
        idPaso                    : datos.idPaso,
        observacion               : datos.observacion,
        descripcion               : datos.descripcion,
        idUsuarioRemitente        : datos.remitente.id,
        nombreRemitente           : datos.remitente.nombre,
        idCargoRemitente          : datos.remitente.idCargo,
        cargoRemitente            : datos.remitente.cargo,
        idUsuarioDestinatario     : datos.destinatario.id,
        nombreDestinatario        : datos.destinatario.nombre,
        idCargoDestinatario       : datos.destinatario.idCargo,
        cargoDestinatario         : datos.destinatario.cargo,
        tipo                      : datos.tipoDerivacion,
        urgente                   : datos.urgente,
        fechaPlazo                : datos.fechaPlazo,
        estadoActual              : 'ACTIVO',
        estado                    : 'INICIO',
        etapa                     : 'PROCESO',
        esObservable              : true,
        userCreated               : datos.idUsuario,
        fechaDerivacion           : new Date(),
        informacionComplementaria : datos.informacionComplementaria
      };

      await DocumentoRepository.createOrUpdate({ id: datos.idDocumento, editable: false }, transaccion);
      // await validarDatosDerivacionNormal(datosSiguienteDerivacion, datos.tipoFlujo);

      nuevaDerivacion = await FlujoDerivacionRepository.createOrUpdate(datosSiguienteDerivacion, transaccion);

      if (!t) await transaction.commit(transaccion);

      return nuevaDerivacion;
    } catch (error) {
      if (!t) await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function clonarAdjuntosReferencias (idDocumento, idNuevoDocumento, t) {
    let transaccion;
    try {
      transaccion = t || await transaction.create();

      if (!idDocumento) throw new Error('Se debe enviar el identificador del documento para realizar la copia de adjuntos y referencias.');

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
      console.log('==========_MENSAJE_A_MOSTRARSE_==========');
      console.log(error);
      console.log('==========_MENSAJE_A_MOSTRARSE_==========');
      if (!t) await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function cerrar (datos, t) {
    let transaccion;
    let nuevaDerivacion;
    try {
      transaccion = t || await transaction.create();

      nuevaDerivacion = await FlujoDerivacionRepository.inactivarRegistros(datos.idFlujo, transaccion);

      const fechaCierre = new Date();

      await registrarInteraccionEntidad(datos.remitente.id, datos.idFlujo, transaccion);
      await registrarInteraccionEntidad(datos.destinatario?.id, datos.idFlujo, transaccion);

      const datosSiguienteDerivacion = {
        idFlujo                   : datos.idFlujo,
        idDocumento               : datos.idDocumento,
        idAccion                  : datos.idAccion,
        idPaso                    : datos.idPaso,
        observacion               : datos.observacion,
        descripcion               : datos.descripcion,
        idUsuarioRemitente        : datos.remitente.id,
        nombreRemitente           : datos.remitente.nombre,
        idCargoRemitente          : datos.remitente.idCargo,
        cargoRemitente            : datos.remitente.cargo,
        idUsuarioDestinatario     : null,
        nombreDestinatario        : 'CERRADO',
        tipo                      : 'CERRADO',
        estadoActual              : 'INACTIVO',
        estado                    : 'DERIVADO',
        etapa                     : 'FIN',
        fechaDerivacion           : fechaCierre,
        fechaRecepcion            : fechaCierre,
        userCreated               : datos.idUsuario,
        informacionComplementaria : datos.informacionComplementaria
      };

      nuevaDerivacion = await FlujoDerivacionRepository.createOrUpdate(datosSiguienteDerivacion, transaccion);

      if (datos.idPaso) {
        await PasoActualRepository.deleteItemCond({ idFlujoDocumental: datos.idFlujo, userDeleted: datos.idUsuario }, transaccion);
        await PasoActualRepository.createOrUpdate({ idFlujoDocumental: datos.idFlujo, idPaso: datos.idPaso, userCreated: datos.idUsuario }, transaccion);
      }

      if (!t) await transaction.commit(transaccion);

      return nuevaDerivacion;
    } catch (error) {
      console.log('ERROR EN CREAR NUEVA DERIVACION', error);
      if (!t) await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function archivar (datos, t) {
    let transaccion;
    let nuevaDerivacion;
    try {
      transaccion = t || await transaction.create();

      nuevaDerivacion = await FlujoDerivacionRepository.inactivarRegistros(datos.idFlujo, transaccion);

      const fechaArchivo = new Date();

      await registrarInteraccionEntidad(datos.remitente.id, datos.idFlujo, transaccion);
      await registrarInteraccionEntidad(datos.destinatario?.id, datos.idFlujo, transaccion);

      const datosSiguienteDerivacion = {
        idFlujo                   : datos.idFlujo,
        idDocumento               : datos.idDocumento,
        idAccion                  : datos.idAccion,
        idPaso                    : datos.idPaso,
        observacion               : datos.observacion,
        descripcion               : datos.descripcion,
        idUsuarioRemitente        : datos.remitente.id,
        nombreRemitente           : datos.remitente.nombre,
        idCargoRemitente          : datos.remitente.idCargo,
        cargoRemitente            : datos.remitente.cargo,
        nombreDestinatario        : 'ARCHIVADO',
        tipo                      : 'ARCHIVADO',
        estadoActual              : 'ACTIVO',
        estado                    : 'DERIVADO',
        etapa                     : 'FIN',
        fechaDerivacion           : fechaArchivo,
        fechaRecepcion            : fechaArchivo,
        userCreated               : datos.idUsuario,
        informacionComplementaria : datos.informacionComplementaria
      };

      nuevaDerivacion = await FlujoDerivacionRepository.createOrUpdate(datosSiguienteDerivacion, transaccion);

      if (datos.idPaso) {
        await PasoActualRepository.deleteItemCond({ idFlujoDocumental: datos.idFlujo, userDeleted: datos.idUsuario }, transaccion);
        await PasoActualRepository.createOrUpdate({ idFlujoDocumental: datos.idFlujo, idPaso: datos.idPaso, userCreated: datos.idUsuario }, transaccion);
      }

      if (!t) await transaction.commit(transaccion);

      return nuevaDerivacion;
    } catch (error) {
      debug('ERROR EN CREAR NUEVA DERIVACION', error);
      if (!t) await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  // DERIVACiONES DE TIPO OBSERVACION
  async function observacionNormal (datos = {}, t) {
    let transaccion;
    try {
      transaccion = t || await transaction.create();

      await FlujoDerivacionRepository.inactivarRegistros(datos.idFlujo, transaccion);

      const documentoOriginal = await DocumentoRepository.findOne({ id: datos.idDocumento }, transaccion);

      if (!documentoOriginal) throw new Error('Ocurrio un error al buscar el documento a observarse.');

      const respuesta = await reemplazarRemitente(documentoOriginal, datos.destinatario, transaccion);
      console.log('==========_DESTINATARIO_OBSERVACION_==========');
      console.log(respuesta.destinatario, datos.destinatario);

      datos.destinatario = respuesta.destinatario;

      const idDocumentoOriginal = documentoOriginal.id;

      documentoOriginal.estado = 'DERIVADO';
      documentoOriginal.editable = true;
      documentoOriginal.fechaDocumento = FechaHelper.formatearFecha(documentoOriginal.fechaDocumento);
      documentoOriginal.idDocumentoPadre = documentoOriginal.id;

      delete documentoOriginal.configuracionFinalizacion;
      if (documentoOriginal.pathDocumentoFirma) {
        delete documentoOriginal.pathDocumentoFirma;
      }
      delete documentoOriginal.id;

      const nuevoDocumento = await DocumentoRepository.createOrUpdate(documentoOriginal, transaccion);

      await clonarAdjuntosReferencias(datos.idDocumento, nuevoDocumento.id, transaccion);

      await DocumentoRepository.createOrUpdate({ id: datos.idDocumento, estado: 'OBSERVADO', editable: false }, transaccion);

      await AprobacionDocumentosRepository.deleteItemCond({ idFlujo: datos.idFlujo, idDocumento: idDocumentoOriginal }, transaccion);

      datos.informacionComplementaria.idDocumentoObservado = idDocumentoOriginal;
      datos.informacionComplementaria.idDocumentoNuevo = nuevoDocumento.id;

      const datosDerivacionObservacion = {
        idFlujo                   : documentoOriginal.idFlujo,
        idDocumento               : nuevoDocumento.id,
        idPaso                    : datos.idPaso,
        estado                    : 'INICIO',
        estadoActual              : 'ACTIVO',
        tipo                      : 'REMITENTE',
        etapa                     : 'INICIO',
        idUsuarioDestinatario     : datos.destinatario.id,
        nombreDestinatario        : datos.destinatario.nombre,
        idCargoDestinatario       : datos.destinatario.idCargo,
        cargoDestinatario         : datos.destinatario.cargo,
        idUsuarioRemitente        : datos.remitente.id,
        nombreRemitente           : datos.remitente.nombre,
        cargoRemitente            : datos.remitente.cargo,
        idCargoRemitente          : datos.remitente.idCargo,
        observacion               : true,
        urgente                   : datos.urgente,
        fechaPlazo                : datos.fechaPlazo,
        descripcion               : datos.descripcion,
        userCreated               : datos.idUsuario,
        fechaDerivacion           : new Date(),
        informacionComplementaria : datos.informacionComplementaria
      };

      const nuevaDerivacion = await FlujoDerivacionRepository.createOrUpdate(datosDerivacionObservacion, transaccion);

      if (!t) await transaction.commit(transaccion);

      return nuevaDerivacion;
    } catch (error) {
      console.log('ERROR EN OBSERVAR NORMAL', error);
      if (!t) await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function derivacionProveidoObservacion (datos, t) {
    let transaccion;
    try {
      transaccion = t || await transaction.create();

      await FlujoDerivacionRepository.inactivarRegistros(datos.idFlujo, transaccion);

      let documentoOriginal = await DocumentoRepository.findOne({ id: datos.idDocumento }, transaccion);

      if (!documentoOriginal) throw new Error('Ocurrio un error al buscar el documento a observarse.');

      const respuesta = await reemplazarRemitente(documentoOriginal, datos.destinatario, transaccion);

      documentoOriginal = respuesta.documento;
      datos.destinatario = respuesta.destinatario;

      const idDocumentoOriginal = documentoOriginal.id;

      datos.informacionComplementaria.destinatario = datos.destinatario;

      documentoOriginal.estado = 'DERIVADO';
      documentoOriginal.editable = true;
      documentoOriginal.fechaDocumento = FechaHelper.formatearFecha(documentoOriginal.fechaDocumento);
      documentoOriginal.idDocumentoPadre = documentoOriginal.id;

      delete documentoOriginal.configuracionFinalizacion;
      delete documentoOriginal.id;

      if (documentoOriginal.pathDocumentoFirma) {
        delete documentoOriginal.pathDocumentoFirma;
      }

      const nuevoDocumento = await DocumentoRepository.createOrUpdate(documentoOriginal, transaccion);

      await clonarAdjuntosReferencias(datos.idDocumento, nuevoDocumento.id, transaccion);

      await DocumentoRepository.createOrUpdate({ id: datos.idDocumento, estado: 'OBSERVADO', editable: false }, transaccion);

      await AprobacionDocumentosRepository.deleteItemCond({ idFlujo: datos.idFlujo, idDocumento: idDocumentoOriginal }, transaccion);

      datos.informacionComplementaria.idDocumentoObservado = idDocumentoOriginal;
      datos.informacionComplementaria.idDocumentoNuevo = nuevoDocumento.id;

      const datosDerivacionObservacion = {
        idFlujo                   : documentoOriginal.idFlujo,
        idDocumento               : nuevoDocumento.id,
        idPaso                    : datos.idPaso,
        estado                    : 'INICIO',
        estadoActual              : 'ACTIVO',
        tipo                      : 'REMITENTE',
        etapa                     : 'INICIO',
        idUsuarioDestinatario     : datos.destinatario.id,
        nombreDestinatario        : datos.destinatario.nombre,
        idCargoDestinatario       : datos.destinatario.idCargo,
        cargoDestinatario         : datos.destinatario.cargo,
        idUsuarioRemitente        : datos.remitente.id,
        nombreRemitente           : datos.remitente.nombre,
        cargoRemitente            : datos.remitente.cargo,
        idCargoRemitente          : datos.remitente.idCargo,
        observacion               : true,
        urgente                   : datos.urgente,
        fechaPlazo                : datos.fechaPlazo,
        descripcion               : datos.descripcion,
        userCreated               : datos.idUsuario,
        fechaDerivacion           : new Date(),
        informacionComplementaria : datos.informacionComplementaria
      };

      const nuevaDerivacion = await FlujoDerivacionRepository.createOrUpdate(datosDerivacionObservacion, transaccion);

      if (!t) await transaction.commit(transaccion);
      return nuevaDerivacion;
    } catch (error) {
      console.log('ERROR AL OBSERVAR CON PROVEIDO CON OBSERVACION', error);
      if (!t) await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function observacionPaso (datos, t) {
    let transaccion;
    let nuevaDerivacion;
    try {
      transaccion = t || await transaction.create();

      nuevaDerivacion = await FlujoDerivacionRepository.inactivarRegistros(datos.idFlujo, transaccion);

      const documentoOriginal = await DocumentoRepository.findOne({ id: datos.idDocumento }, transaccion);

      if (!documentoOriginal) throw new Error('Ocurrio un error al buscar el documento a observarse.');

      const datosSiguienteDerivacion = {
        idFlujo                   : datos.idFlujo,
        idDocumento               : datos.idDocumento,
        idAccion                  : datos.idAccion,
        idPaso                    : datos.idPaso,
        observacion               : true,
        descripcion               : datos.descripcion,
        idUsuarioRemitente        : datos.remitente.id,
        nombreRemitente           : datos.remitente.nombre,
        idCargoRemitente          : datos.remitente.idCargo,
        cargoRemitente            : datos.remitente.cargo,
        idUsuarioDestinatario     : datos.destinatario.id,
        nombreDestinatario        : datos.destinatario.nombre,
        idCargoDestinatario       : datos.destinatario.idCargo,
        cargoDestinatario         : datos.destinatario.cargo,
        tipo                      : 'REMITENTE',
        urgente                   : datos.urgente,
        fechaPlazo                : datos.fechaPlazo,
        fechaDerivacion           : new Date(),
        estadoActual              : 'INACTIVO',
        estado                    : 'DERIVADO',
        etapa                     : 'INICIO',
        userCreated               : datos.idUsuario,
        informacionComplementaria : datos.informacionComplementaria
      };

      console.log('==========_OBSERVACION_PASO_==========');
      console.log({ idPaso: datos.idPaso, idFlujo: datos.idFlujo, tipo: 'REMITENTE' });

      const { rows } = await FlujoDerivacionRepository.findAll({ idPaso: datos.idPaso, idFlujo: datos.idFlujo, order: '-createdAt' });

      let tipo = 'DESTINATARIO';

      const existeUnRemitente = rows.some(x => x.tipo === 'REMITENTE');

      if (existeUnRemitente) tipo = 'REMITENTE';

      const copiarDerivacion = await FlujoDerivacionRepository.ultimaDerivacion({ idPaso: datos.idPaso, idFlujo: datos.idFlujo, tipo }, ['createdAt', 'DESC'], transaccion);

      if (!copiarDerivacion) throw new Error('Ocurio un error al observar.');

      const documentoAnterior = await DocumentoRepository.findOne({ id: copiarDerivacion.idDocumento }, transaccion);
      const idDocumentoAnterior = documentoAnterior.id;
      documentoAnterior.estado = 'DERIVADO';
      documentoAnterior.editable = true;
      documentoAnterior.fechaDocumento = FechaHelper.formatearFecha(documentoAnterior.fechaDocumento);
      documentoAnterior.idDocumentoPadre = documentoAnterior.id;
      delete documentoAnterior.id;
      delete documentoAnterior.configuracionFinalizacion;

      await PasoActualRepository.deleteItemCond({ idFlujoDocumental: datos.idFlujo, userDeleted: datos.idUsuario }, transaccion);
      await PasoActualRepository.createOrUpdate({ idFlujoDocumental: datos.idFlujo, idPaso: copiarDerivacion?.idPaso, userCreated: datos.idUsuario }, transaccion);

      const nuevoDocumento = await DocumentoRepository.createOrUpdate(documentoAnterior, transaccion);

      await clonarAdjuntosReferencias(idDocumentoAnterior, nuevoDocumento.id, transaccion);

      nuevaDerivacion = await FlujoDerivacionRepository.createOrUpdate(datosSiguienteDerivacion, transaccion);

      // await DocumentoRepository.createOrUpdate({ id: documentoOriginal.id, estado: 'OBSERVADO', editable: false }, transaccion);

      // await AprobacionDocumentosRepository.deleteItemCond({ idFlujo: datos.idFlujo, idDocumento: documentoOriginal.id }, transaccion);

      datos.informacionComplementaria.idRecepcionar = nuevaDerivacion.id;

      const datosSiguienteDerivacionDocumento = {
        idFlujo                   : datos.idFlujo,
        idDocumento               : nuevoDocumento.id,
        idAccion                  : datos.idAccion,
        idPaso                    : datos.idPaso,
        observacion               : true,
        descripcion               : datos.descripcion,
        idUsuarioDestinatario     : datos.destinatario.id,
        nombreDestinatario        : datos.destinatario.nombre,
        idCargoDestinatario       : datos.destinatario.idCargo,
        cargoDestinatario         : datos.destinatario.cargo,
        tipo                      : 'REMITENTE',
        urgente                   : datos.urgente,
        fechaPlazo                : datos.fechaPlazo,
        fechaDerivacion           : new Date(),
        estadoActual              : 'ACTIVO',
        estado                    : 'INICIO',
        userCreated               : datos.idUsuario,
        informacionComplementaria : datos.informacionComplementaria
      };

      nuevaDerivacion = await FlujoDerivacionRepository.createOrUpdate(datosSiguienteDerivacionDocumento, transaccion);

      if (!t) await transaction.commit(transaccion);
      return nuevaDerivacion;
    } catch (error) {
      console.log('ERROR EN CREAR NUEVA DERIVACION', error);
      if (!t) await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  return {
    reemplazarRemitente,
    clonarAdjuntosReferencias,
    registrarInteraccionEntidad,
    observacionNormal,
    observacionPaso,
    derivacionProveidoObservacion,
    derivarCrearDocumento,
    derivarProveido,
    derivarNuevoDocumento,
    cerrar,
    archivar,
    derivacionNormal
  };
};
