'use strict';

const debug = require('debug')('app:service:auth');
const moment = require('moment');
const axios = require('axios');
const sha256 = require('sha256');
const uuid = require('uuid');
const log = require('log4js').getLogger();
const { aprobacion } = require('../../../common/config/openid');
const {
  obtenerPdfGeneradoB64,
  documentoPdfGenerar,
  documentoJsonGenerar,
  eliminarPdfGenerado,
  guardarPdfContentB64,
  eliminarPdfContentB64,
  guardarPdfAprobado
} = require('../../../common/lib/archivos');
const { ErrorApp } = require('../../lib/error');
const { config } = require('../../../common');

module.exports = function AprobacionDocumentosService (repositories, helpers, res) {
  const AuthService = require('./AuthService')(repositories, helpers, res);

  const { checkCiudadaniaStatus } = require('../externos/CiudadanoService')(repositories, helpers, null);

  const {
    AprobacionDocumentosRepository,
    AuthRepository,
    UsuarioRepository,
    AreaRepository,
    ParametroRepository,
    LogIopRepository,
    transaction,
    DocumentoRepository
  } = repositories;

  async function listar (params) {
    try {
      const aprobacionDocumentos = await AprobacionDocumentosRepository.findAll(params);
      return aprobacionDocumentos;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function findOne (params) {
    try {
      const aprobacionDocumentos = await AprobacionDocumentosRepository.findOne(params);
      return aprobacionDocumentos;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function generarSolicitudSinValidacion (params, t) {
    let transaccion;
    try {
      transaccion = t || await transaction.create();
      const tramite = uuid.v4();
      const contenidoB64 = obtenerPdfGeneradoB64(`${params.documento.id}.pdf`);
      const hashDocumento = sha256(contenidoB64);
      const usuario = await UsuarioRepository.findOne({ id: params.idUsuario });

      if (!usuario) throw new Error('No se pudo encontrar el usuario.');

      const registroAprobacion = await AprobacionDocumentosRepository.createOrUpdate({
        idUsuario             : usuario.id,
        idFlujo               : params.documento.idFlujo,
        idDocumento           : params.documento.id,
        tramite,
        urlRedireccion        : 'SIN LINKs',
        fechaHoraSolicitud    : moment().format('DD/MM/YYYY HH:mm:ss'),
        hashDatos             : hashDocumento,
        ci                    : usuario.numeroDocumento,
        descripcion           : params.documento.asunto,
        nombreArchivo         : `${params.documento.id}.pdf`,
        urlRedireccionCliente : '',
        userCreated           : usuario.id
      });

      if (!t) await transaction.commit(transaccion);
      return registroAprobacion;
    } catch (error) {
      if (!t) await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function generarSolicitud (params) {
    const t = await transaction.create();
    try {
      const solicitudAntigua = await AprobacionDocumentosRepository.findOne({ id: params.id });

      const documento = await DocumentoRepository.findOne({ id: solicitudAntigua.idDocumento });
      const nombreFile = documento.pathDocumentoFirma ? documento.pathDocumentoFirma : `${documento.id}.pdf`;
      const contenidoB64 = obtenerPdfGeneradoB64(nombreFile);
      const hashDocumento = sha256(contenidoB64);
      const firmaExistente = await AprobacionDocumentosRepository.findOne({ idDocumento: documento.id, hash_datos: hashDocumento, introducido: true, aceptado: true });
      if (!firmaExistente && documento.linkFirma === 'app/error-firma' &&
      documento.plantilla.configuracion_json.filter(item => item.type === 'upload' && item.mergePdf === true).length > 0) {
        eliminarPdfGenerado(`${documento.id}.pdf`);
        documento.plantilla.configuracion_json.map(item => {
          if (item.type === 'upload') item.mergePdf = false;
          return item;
        });
        await DocumentoRepository.createOrUpdate({ id: documento.id, plantilla: documento.plantilla }, t);
        documentoJsonGenerar(documento);
        await documentoPdfGenerar(`${documento.id}.pdf`, documento.id, repositories, helpers, false);
      }
      await AprobacionDocumentosRepository.deleteItemCond({ id: params.id }, t);

      const estadoIOP = await ParametroRepository.findOne({ grupo: 'CONFIG-IOP', codigo: 'IOP' });

      const datos = await generarAprobacion({
        documento,
        idUsuario             : params.idUsuario,
        descripcion           : solicitudAntigua.descripcion,
        urlRedireccionCliente : solicitudAntigua.urlRedireccionCliente,
        token                 : params.token
      }, t, estadoIOP.estado === 'ACTIVO');
      await transaction.commit(t);
      return datos;
    } catch (err) {
      await transaction.rollback(t);
      console.error('\n\n', '==================================================================');
      console.error('\t>>> ERROR GENERAR SOLICITUD PENDIENTE DE APROBACION: ', err);
      console.error('==================================================================', '\n\n');
      throw new ErrorApp(err.message, 400);
    }
  }

  async function generarAprobacion ({ documento, idUsuario, descripcion, urlRedireccionCliente, token: tokenSistema }, t = null, estadoIOP = true, it = 0) {
    let auth, logIop, status, data, usuario, registroAprobacion, hashDocumento;
    const tramite = uuid.v4();
    let errorMensaje = null;
    const transaccion = t ?? await transaction.create();
    try {
      const nombreFile = documento.pathDocumentoFirma ? documento.pathDocumentoFirma : `${documento.id}.pdf`;
      const contenidoB64 = obtenerPdfGeneradoB64(nombreFile);
      hashDocumento = sha256(contenidoB64);
      usuario = await UsuarioRepository.findOne({ id: idUsuario });

      if (!usuario) throw new Error('No se pudo encontrar el usuario.');

      const { aprobacionCiudadaniaDigital } = config.app;

      if (aprobacionCiudadaniaDigital) auth = await AuthRepository.findOne({ tokenSistema });

      if (!aprobacionCiudadaniaDigital) auth = await AuthRepository.findOne({ idUsuario });

      if (!estadoIOP) {
        throw new Error('Se inactivo las solicitudes al servicio de CIUDADANIA DIGITAL.');
      }
      if (!auth) throw new Error('No se pudo encontrar access token para ciudadania digital.');

      if (!auth.authCiudadania && aprobacionCiudadaniaDigital) {
        throw new Error('No inició con ciudadania digital.');
      }

      const init = {
        method : 'POST',
        url    : aprobacion.url,
        data   : {
          tipoDocumento : 'PDF',
          hashDocumento,
          idTramite     : tramite,
          descripcion,
          token         : auth.tokens?.access_token
        },
        headers: {
          Authorization  : `Bearer ${aprobacion.iopToken}`,
          'Content-type' : 'application/json'
        }
      };

      logIop = await LogIopRepository.createOrUpdate({ idTramite: tramite, envio: init, fechaEnvio: new Date(), userCreated: usuario.id }, transaccion);

      await checkCiudadaniaStatus();

      init.data.documento = contenidoB64;

      if (aprobacionCiudadaniaDigital) {
        errorMensaje = 'Error en la comunicación con el servicio de CIUDADANIA DIGITAL.';

        ({ status, data } = await axios(init));
        // if (status === 200) {
        //   guardarPdfContentB64(`${documento.id}.data`)
        // }
      } else {
        status = 200;
        data = {
          finalizado : true,
          estado     : 'CREADO',
          link       : `/firmar-agetic?tramite=${tramite}&documento=${documento.id}`
        };
      }

      if (![200,201].includes(status)) {
        if (status === 401) throw new Error('Su sesión a caducado. Guarda tus cambios y reinicia la sesión para continuar.');
        else throw new Error(data.mensaje);
      } else if (documento.pathDocumentoFirma === null) guardarPdfContentB64(`${documento.id}.data`, contenidoB64);

      await LogIopRepository.createOrUpdate({ id: logIop.id, respuesta: data, fechaRespuesta: new Date(), userUpdated: usuario.id }, transaccion);

      registroAprobacion = await AprobacionDocumentosRepository.createOrUpdate({
        idUsuario          : usuario.id,
        idFlujo            : documento.idFlujo,
        idDocumento        : documento.id,
        tramite,
        urlRedireccion     : data.link,
        fechaHoraSolicitud : moment().format('DD/MM/YYYY HH:mm:ss'),
        hashDatos          : hashDocumento,
        ci                 : usuario.numeroDocumento,
        descripcion,
        nombreArchivo      : `${documento.id}.pdf`,
        urlRedireccionCliente,
        userCreated        : usuario.id
      }, transaccion);

      if (!t) await transaction.commit(transaccion);

      return {
        idRegistroAprobacion : registroAprobacion.id,
        finalizado           : data.finalizado,
        estadoProceso        : data.estado,
        linkRedireccion      : data.finalizado === true ? data.link : null
      };
    } catch (error) {
      console.error(error);
      if (estadoIOP && !t) {
        await transaction.rollback(transaccion);
      }
      if (!estadoIOP) {
        registroAprobacion = await AprobacionDocumentosRepository.createOrUpdate({
          idUsuario          : usuario?.id || idUsuario,
          idFlujo            : documento.idFlujo,
          idDocumento        : documento.id,
          tramite,
          urlRedireccion     : data?.link || 'SIN LINK',
          fechaHoraSolicitud : moment().format('DD/MM/YYYY HH:mm:ss'),
          hashDatos          : hashDocumento || null,
          ci                 : usuario?.numeroDocumento || null,
          descripcion,
          nombreArchivo      : `${documento.id}.pdf`,
          urlRedireccionCliente,
          userCreated        : usuario.id || idUsuario
        }, transaccion);
        if (logIop) await LogIopRepository.createOrUpdate({ id: logIop.id, respuesta: { mensaje: error.message }, fechaRespuesta: new Date(), userUpdated: usuario?.id || idUsuario }, transaccion);
      }
      if (error.response && error.response.status === 401 && it === 0) {
        await AuthService.verificarVigenciaAccessToken(auth.tokenSistema, true);
        try {
          return await generarAprobacion({ documento, idUsuario, descripcion, urlRedireccionCliente, token: tokenSistema }, t, estadoIOP, it + 1);
        } catch (err) {
          throw err;
        }
      } else {
        if (error.response.status === 401 && it !== 0) errorMensaje = 'Su sesión ha caducado. Guarda tus cambios y reinicia la sesión para continuar.'
        if (errorMensaje) throw new Error(errorMensaje);
        else throw error;
      }
    }
  }

  /**
   * Recibe la notificacion de solicitud de aprobación y la procesa.
   * Busca en la BD la solicitud de aprobación asociada y si existe un documento, lo marca como
   * firmado.
   * @param respuestaServicio (object): {
   *   aceptado: boolean,
   *   introducido: boolean,
   *   requestUuid: string,
   *   codigoOperacion: string,
   *   mensaje: string,
   *   transaction_id: string,
   *   fechaHoraSolicitud: string,
   *   hashDatos: string,
   *   ci: string
   * }
   * @return object registro de aprobacion con ciudaanía digital
   */
  async function resultadoAprobacion (respuestaServicio = {
    aceptado           : false,
    introducido        : false,
    requestUuid        : '',
    codigoOperacion    : '',
    mensaje            : '',
    transaction_id     : '',
    fechaHoraSolicitud : '',
    hashDatos          : '',
    ci                 : ''
  }) {
    console.log('Notificación de aprobación de documentos con ciudadanía digital===================');
    console.log(respuestaServicio);
    // TODO aniadir caso en que no se haya rechazado el documento

    let registroAprobacion;
    const logEncontrado = await LogIopRepository.findOne({ idTramite: respuestaServicio.requestUuid });

    try {
      if (logEncontrado) {
        await LogIopRepository.createOrUpdate({ id: logEncontrado.id, notificacion: respuestaServicio, fechaNotificacion: new Date() });
      }

      registroAprobacion = await AprobacionDocumentosRepository.findOne({ tramite: respuestaServicio.requestUuid });

      if (!registroAprobacion) throw new Error('Este documento, no tiene un registro de aprobación,');
    } catch (err) {
      log.error(`No se ha encontrado registro de aprobación con ciudadanía de tramite; ${respuestaServicio.requestUuid}`);
      log.error(err);
      if (logEncontrado) {
        await LogIopRepository.createOrUpdate({
          id             : logEncontrado.id,
          respuesta      : { mensaje: err.message },
          fechaRespuesta : new Date(),
          userUpdated    : logEncontrado.userCreated
        });
      }
      throw new Error(`No se ha encontrado registro de aprobación con ciudadanía de tramite; ${respuestaServicio.requestUuid}`);
    }

    let actualizado;
    try {
      if (respuestaServicio.aceptado === false) {
        // USUARIO NEGO LA APROBACION
        console.log('==========_DESDE_RECHAZO_==========');
        console.log('USUARIO RECHAZÓ LA APROBACIÓN');
        console.log('==========_DESDE_RECHAZO_==========');
        // revertirDerivacion(registroAprobacion?.documentoAprobado?.idFlujo, registroAprobacion.usuario.id);
      }

      // if (respuestaServicio.introducido === false) {
      //   throw new Error('Error en aprobacion por ciudadania, AGETIC no completo la solicitud  en  la blockchain.');
      // }

      actualizado = await AprobacionDocumentosRepository.createOrUpdate({
        id              : registroAprobacion.id,
        codigoOperacion : respuestaServicio.codigoOperacion,
        transactionId   : respuestaServicio.transaction_id,
        aceptado        : respuestaServicio.aceptado,
        introducido     : respuestaServicio.introducido,
        userUpdated     : registroAprobacion.usuario.id
      });
      log.debug('Registro de aprobación de documento con ciudadanía digital actualizado.');
    } catch (err) {
      if (logEncontrado) {
        await LogIopRepository.createOrUpdate({
          id             : logEncontrado.id,
          respuesta      : { mensaje: err.message },
          fechaRespuesta : new Date(),
          userUpdated    : logEncontrado.userCreated
        });
      }
      log.error(`Error actualizando registro de aprobación con ciudadanía digital ${registroAprobacion.id}`);
      log.error(err);
      throw new Error(`Error actualizando registro de aprobación con ciudadanía digital ${registroAprobacion.id}`);
    }
    const documento = await DocumentoRepository.findOne({ id: registroAprobacion.idDocumento });
    try {
      if (respuestaServicio.aceptado && respuestaServicio.introducido && documento.pathDocumentoFirma === null) {
        const path = guardarPdfAprobado(`${documento.id}.pdf`);
        if (path) await DocumentoRepository.createOrUpdate({ id: documento.id, pathDocumentoFirma: path });
      }
      if (!respuestaServicio.aceptado && !respuestaServicio.introducido && documento.pathDocumentoFirma === null) {
        const contenidoB64 = obtenerPdfGeneradoB64(`${documento.id}.pdf`);
        const hashDocumento = sha256(contenidoB64);
        const firmaExistente = await AprobacionDocumentosRepository.findOne({ idDocumento: documento.id, hash_datos: hashDocumento, introducido: true, aceptado: true });
        if (firmaExistente === null) {
          eliminarPdfContentB64(`${documento.id}.data`);
        }
      }
    } catch (error) {
      log.error(error);
      console.error(error);
    }

    // if (!registroAprobacion.documentoAprobado.firmado) {
    //   const estados = { ARCHIVAR: 'ARCHIVADO', CERRAR: 'CERRAR' };
    //   const usuario = await UsuarioRepository.findOne({ id: registroAprobacion.usuario.id });
    //   const area = await AreaRepository.findOne({ id: usuario.cargoUsuario.configuracionCargos[0].idUnidadOrganizacional });
    //   const data = {
    //     id            : registroAprobacion.documentoAprobado.id,
    //     firmado       : respuestaServicio.aceptado === true && respuestaServicio.introducido === true,
    //     userUpdated   : registroAprobacion.usuario.id,
    //     clasificacion : registroAprobacion.documentoAprobado.clasificacion,
    //     accion        : registroAprobacion.accion,
    //     areaUsuario   : area
    //   };
    //   if (estados[registroAprobacion.accion]) {
    //     data.estado = estados[registroAprobacion.accion];
    //   }
    //   try {
    //     // await DocumentoRepository.update(data);

    //     // TODO ejecutar paso siguiente de solicitud SIPFA
    //     log.debug(`Documento actualizado: ${registroAprobacion.documentoAprobado.cite}`);
    //   } catch (err) {
    //     log.error(`Error actualizando documento para registro con requestUuid ${respuestaServicio.requestUuid}`);
    //     log.error(err);
    //     throw new Error(`Error actualizando documento para registro con requestUuid ${respuestaServicio.requestUuid}`);
    //   }
    // }

    return actualizado;
  }

  async function verificarAprobacion (params) {
    try {
      const usuario = await UsuarioRepository.findOne({ id: params.idUsuario });
      let aprobacion = await AprobacionDocumentosRepository.findOne({ idUsuario: usuario.id, tramite: params.requestUuid });
      // console.log('datos', aprobacion);
      // throw new Error('Prueba');
      if (aprobacion) {
        console.log('aprobacion', aprobacion);
        if (!aprobacion.aceptado && !aprobacion.introducido && params.estado === 'true' && params.finalizado === 'true') {
          const notificacion = {
            aceptado              : true,
            introducido           : true,
            codigoOperacion       : params.uuidBlockchain,
            transactionId         : params.transactionCode,
            urlRedireccionCliente : aprobacion.urlRedireccionCliente
          };
          aprobacion = await AprobacionDocumentosRepository.createOrUpdate({ id: aprobacion.id, ...notificacion });
        }
        return aprobacion;
      } else {
        throw new Error('No se encontro el código de transacción');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  return {
    generarSolicitud,
    listar,
    findOne,
    generarAprobacion,
    resultadoAprobacion,
    generarSolicitudSinValidacion,
    verificarAprobacion
  };
};
