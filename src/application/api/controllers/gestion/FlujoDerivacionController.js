'use strict';
const debug = require('debug')('app:controller:FlujoDerivacion');
const { Respuesta } = require('../../../lib/respuesta');
const { Finalizado, HttpCodes } = require('../../../lib/globals');
const moment = require('moment');
const { app, constants } = require('../../../../common/config');
const validate = require('validate.js');
const { CLASIFICACION_FLUJO } = require('../../../../common/config/constants');

module.exports = function setupFlujoDerivacionController (services) {
  const {
    FlujoDerivacionService,
    DocumentoService,
    AprobacionDocumentosService,
    AuthService,
    DerivacionService,
    FlujoDocumentalService,
    CargoService,
    CorrelativoService,
    EntidadService,
    AreaService,
    FormularioService
  } = services;

  async function listar (req, res) {
    try {
      req.query.idUsuarioDestinatario = req.user.idUsuario;
      req.query.idCargoDestinatario = req.user.idCargo;
      const respuesta = await FlujoDerivacionService.listar(req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function listarBandejaReasignacion (req, res) {
    try {
      if (!req.query.idUsuarioDestinatario || !req.query.idCargoDestinatario) throw new Error('Faltan parametros para consultar.');

      const respuesta = await FlujoDerivacionService.listar(req.query);
      for (const row of respuesta.rows) {
        row.seleccionado = req.query.todos === 'true';
      }

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function listarPendientesFirma (req, res) {
    try {
      req.query.idUsuarioDestinatario = req.user.idUsuario;
      req.query.idCargoDestinatario = req.user.idCargo;
      const respuesta = await FlujoDerivacionService.listarPendientesFirma(req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function cantidades (req, res) {
    try {
      req.query.idUsuarioDestinatario = req.user.idUsuario;
      req.query.idCargoDestinatario = req.user.idCargo;

      const respuesta = await FlujoDerivacionService.cantidades(req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function derivar (req, res) {
    try {
      const datos = req.body;
      datos.id = req.params.id;
      datos.userUpdated = req.user.idUsuario;
      const respuesta = await FlujoDerivacionService.derivar(datos);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function derivacionFinal (req, res) {
    try {
      const datos = req.body;
      datos.id = req.params.id;
      datos.userUpdated = req.user.idUsuario;
      const respuesta = await FlujoDerivacionService.derivacionFinal(datos);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function devolverAPendientes (req, res) {
    try {
      const respuesta = await FlujoDerivacionService.revertirDerivacion(req.params.idFlujo, req.user.idUsuario);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function recepcionar (req, res) {
    try {
      const datos = {
        id             : req.params.id,
        estado         : 'RECIBIDO',
        fechaRecepcion : new Date(),
        userUpdated    : req.user.idUsuario
      };
      const respuesta = await FlujoDerivacionService.recepcionar(datos);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function observar (req, res) {
    try {
      const datos = {
        id                 : req.params.id,
        idUsuarioRemitente : req.body.idUsuarioRemitente,
        idCargoRemitente   : req.body.idCargoRemitente,
        cargoRemitente     : req.body.cargoRemitente,
        observacion        : req.body.descripcion,
        urgente            : req.body.urgente,
        fechaPlazo         : req.body.fechaPlazo,
        idUsuario          : req.user.idUsuario
      };

      const respuesta = await FlujoDerivacionService.observar(datos);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function generarArobacionCiudadaniaUsuario (req, res) {
    try {
      const documento = await DocumentoService.findOne({ id: req.params.id });

      if (!documento) throw new Error('El documento no existe.');

      documento.linkFirma = `gestion/flujos-derivacion/aprobacion/${req.params.id}?admin=false`;

      await DocumentoService.createOrUpdate(documento, false);

      if (!DocumentoService.existPathPDF(req.params.id)) await DocumentoService.generarPdf(req.params.id, false);

      const aprobacionCiudadania = await AprobacionDocumentosService.iniciarProcesoAprobacion(documento, req.user.idUsuario, documento.asunto, '', 'CERRAR', req.user.token);

      documento.linkRedireccion = aprobacionCiudadania.linkRedireccion;
      documento.linkFirma = aprobacionCiudadania.linkRedireccion;

      await DocumentoService.createOrUpdate(documento, false);

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, documento));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function aprobacionCiudadania (req, res) {
    try {
      const documento = await DocumentoService.findOne({ id: req.params.id });
      const ID_ROL_SUPER_ADMIN = '88b0104c-1bd1-42b2-bb01-9bf0502bab5a';

      if (req.user.idRoles.includes(ID_ROL_SUPER_ADMIN) && !req.query.admin) {
        documento.linkFirma = `gestion/flujos-derivacion/aprobacion/${req.params.id}?admin=false`;
        await DocumentoService.createOrUpdate(documento, false);
        return res.status(200).send(new Respuesta('OK', Finalizado.OK, documento));
      } else {
        if (!DocumentoService.existPathPDF(req.params.id)) await DocumentoService.generarPdf(req.params.id, false);

        const aprobacionCiudadania = await AprobacionDocumentosService.iniciarProcesoAprobacion(documento, req.user.idUsuario, documento.asunto, '', 'CERRAR', req.user.token);
        documento.linkRedireccion = aprobacionCiudadania.linkRedireccion;
        documento.linkFirma = aprobacionCiudadania.linkRedireccion;
        await DocumentoService.createOrUpdate(documento, false);
        return res.status(200).send(new Respuesta('OK', Finalizado.OK, documento));
      }
    } catch (error) {
      debug(error);
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function actualizarEstado (req, res) {
    try {
      if (app.aprobacionCiudadaniaDigital) {
        await AuthService.verificarVigenciaAccessToken(req.user.token);
      }

      const datos = req.body;
      datos.id = req.params.id;
      datos.token = req.user.token;
      datos.fechaPlazo = req.body.fechaPlazo ? moment(req.body.fechaPlazo, 'DD-MM-YYYY').format('YYYY-MM-DD') : null;
      datos.userUpdated = req.user.idUsuario;
      datos.idUsuario = req.user.idUsuario;

      const respuesta = await FlujoDerivacionService.createOrUpdate(datos);

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function derivacionNormal (req, res) {
    try {
      const datos = req.body;

      const constraintsGeneral = {
        clasificacion : { presence: { message: 'Es requerido' } },
        idAccion      : { presence: { message: 'Es requerido' } },
        remitente     : { presence: { message: 'Es requerido' } },
        destinatario  : { presence: { message: 'Es requerido' } },
        descripcion   : { presence: { message: 'Es requerido' } },
        tipo          : { presence: { message: 'Es requerido' } }
      };

      if (datos.tipoFlujo === constants.TIPO_FLUJO_DOCUMENTAL_SIPFA) constraintsGeneral.idPaso =  { presence: { message: 'Es requerido' } };

      const resultadoValidacion = await validate(datos, constraintsGeneral);

      if (resultadoValidacion) throw new Error(resultadoValidacion[Object.keys(resultadoValidacion)[0]][0]);

      if (app.aprobacionCiudadaniaDigital) await AuthService.verificarVigenciaAccessToken(req.user.token);

      datos.id = req.params.id;
      datos.token = req.user.token;
      datos.fechaPlazo = req.body.fechaPlazo ? moment(req.body.fechaPlazo, 'DD-MM-YYYY').format('YYYY-MM-DD') : null;
      datos.userUpdated = req.user.idUsuario;
      datos.idUsuario = req.user.idUsuario;
      datos.generarCitePostergado = true;

      const respuesta = await FlujoDerivacionService.derivacionNormal(datos);

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      console.error("ERROR DESDE CONTROLLER => ", error)
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function derivacionArchivar (req, res) {
    try {
      const datos = req.body;
      const constraintsGeneral = {
        clasificacion : { presence: { message: 'Es requerido' } },
        idAccion      : { presence: { message: 'Es requerido' } },
        remitente     : { presence: { message: 'Es requerido' } },
        descripcion   : { presence: { message: 'Es requerido' } },
        idCarpeta     : { presence: { message: 'Es requerido' } },
        tipoFlujo     : { presence: { message: 'Es requerido' } }
      };

      if (datos.tipoFlujo === constants.TIPO_FLUJO_DOCUMENTAL_SIPFA) constraintsGeneral.idPaso =  { presence: { message: 'Es requerido' } };

      const resultadoValidacion = await validate(datos, constraintsGeneral);

      if (resultadoValidacion) throw new Error(resultadoValidacion[Object.keys(resultadoValidacion)[0]][0]);

      if (app.aprobacionCiudadaniaDigital) await AuthService.verificarVigenciaAccessToken(req.user.token);

      datos.id = req.params.id;
      datos.token = req.user.token;
      datos.userUpdated = req.user.idUsuario;
      datos.idUsuario = req.user.idUsuario;
      datos.generarCitePostergado = false;

      const respuesta = await FlujoDerivacionService.derivacionArchivar(datos);

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function derivacionCerrar (req, res) {
    try {
      const datos = req.body;

      const constraintsGeneral = {
        clasificacion : { presence: { message: 'Es requerido' } },
        remitente     : { presence: { message: 'Es requerido' } },
        descripcion   : { presence: { message: 'Es requerido' } },
        idAccion      : { presence: { message: 'Es requerido' } },
        tipo          : { presence: { message: 'Es requerido' } },
        tipoFlujo     : { presence: { message: 'Es requerido' } }
      };

      if (datos.tipoFlujo === constants.TIPO_FLUJO_DOCUMENTAL_SIPFA) constraintsGeneral.idPaso =  { presence: { message: 'Es requerido' } };

      const resultadoValidacion = await validate(datos, constraintsGeneral);

      if (resultadoValidacion) throw new Error(resultadoValidacion[Object.keys(resultadoValidacion)[0]][0]);

      if (app.aprobacionCiudadaniaDigital) await AuthService.verificarVigenciaAccessToken(req.user.token);

      if (app.aprobacionCiudadaniaDigital) await AuthService.verificarVigenciaAccessToken(req.user.token);

      datos.id = req.params.id;
      datos.token = req.user.token;
      datos.userUpdated = req.user.idUsuario;
      datos.idUsuario = req.user.idUsuario;
      datos.generarCitePostergado = false;

      const respuesta = await FlujoDerivacionService.derivacionCerrar(datos);

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      debug(error);
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function derivacionProveido (req, res) {
    try {
      const datos = req.body;

      const constraintsGeneral = {
        clasificacion : { presence: { message: 'Es requerido' } },
        remitente     : { presence: { message: 'Es requerido' } },
        destinatario  : { presence: { message: 'Es requerido' } },
        descripcion   : { presence: { message: 'Es requerido' } },
        idAccion      : { presence: { message: 'Es requerido' } },
        tipo          : { presence: { message: 'Es requerido' } },
        tipoFlujo     : { presence: { message: 'Es requerido' } }
      };

      if (datos.tipoFlujo === constants.TIPO_FLUJO_DOCUMENTAL_SIPFA) constraintsGeneral.idPaso =  { presence: { message: 'Es requerido' } };

      const resultadoValidacion = await validate(datos, constraintsGeneral);

      if (resultadoValidacion) throw new Error(resultadoValidacion[Object.keys(resultadoValidacion)[0]][0]);

      if (app.aprobacionCiudadaniaDigital) await AuthService.verificarVigenciaAccessToken(req.user.token);

      datos.id = req.params.id;
      datos.token = req.user.token;
      datos.fechaPlazo = req.body.fechaPlazo ? moment(req.body.fechaPlazo, 'DD-MM-YYYY').format('YYYY-MM-DD') : null;
      datos.userUpdated = req.user.idUsuario;
      datos.idUsuario = req.user.idUsuario;
      datos.generarCitePostergado = true;

      const respuesta = await FlujoDerivacionService.derivacionProveido(datos);

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      debug(error);
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function derivacionCrearDocumento (req, res) {
    try {
      const datos = req.body;

      const constraintsGeneral = {
        clasificacion        : { presence: { message: 'Es requerido' } },
        idAccion             : { presence: { message: 'Es requerido' } },
        remitente            : { presence: { message: 'Es requerido' } },
        descripcion          : { presence: { message: 'Es requerido' } },
        tipo                 : { presence: { message: 'Es requerido' } },
        tipoFlujo            : { presence: { message: 'Es requerido' } },
        idPlantillaDocumento : { presence: { message: 'Es requerido' } }
      };

      const resultadoValidacion = await validate(datos, constraintsGeneral);

      if (resultadoValidacion) throw new Error(resultadoValidacion[Object.keys(resultadoValidacion)[0]][0]);

      if (app.aprobacionCiudadaniaDigital) await AuthService.verificarVigenciaAccessToken(req.user.token);

      datos.id = req.params.id;
      datos.token = req.user.token;
      datos.userUpdated = req.user.idUsuario;
      datos.idUsuario = req.user.idUsuario;
      datos.generarCitePostergado = true;

      const respuesta = await FlujoDerivacionService.derivacionCrearDocumento(datos);

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      debug(error);
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function observacionNormal (req, res) {
    try {
      const datos = req.body;

      const constraintsGeneral = {
        clasificacion : { presence: { message: 'Es requerido' } },
        remitente     : { presence: { message: 'Es requerido' } },
        descripcion   : { presence: { message: 'Es requerido' } },
        idDocumento   : { presence: { message: 'Es requerido' } },
        idAccion      : { presence: { message: 'Es requerido' } },
        tipo          : { presence: { message: 'Es requerido' } },
        tipoFlujo     : { presence: { message: 'Es requerido' } }
      };

      const resultadoValidacion = await validate(datos, constraintsGeneral);

      if (datos.tipoFlujo === constants.TIPO_FLUJO_DOCUMENTAL_SIPFA) constraintsGeneral.idPaso =  { presence: { message: 'Es requerido' } };

      if (resultadoValidacion) throw new Error(resultadoValidacion[Object.keys(resultadoValidacion)[0]][0]);

      datos.id = req.params.id;
      datos.token = req.user.token;
      datos.fechaPlazo = req.body.fechaPlazo ? moment(req.body.fechaPlazo, 'DD-MM-YYYY').format('YYYY-MM-DD') : null;
      datos.userUpdated = req.user.idUsuario;
      datos.idUsuario = req.user.idUsuario;
      datos.generarCitePostergado = false;
      
      const respuesta = await FlujoDerivacionService.observacionNormal(datos);

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      debug(error);
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function observacionDesvinculacion (req, res) {
    try {
      const datos = req.body;

      const constraintsGeneral = {
        idFlujo      : { presence: { message: 'Es requerido' } },
        remitente    : { presence: { message: 'Es requerido' } },
        destinatario : { presence: { message: 'Es requerido' } },
        descripcion  : { presence: { message: 'Es requerido' } },
        idDocumento  : { presence: { message: 'Es requerido' } },
        idAccion     : { presence: { message: 'Es requerido' } },
        tipo         : { presence: { message: 'Es requerido' } },
        tipoFlujo    : { presence: { message: 'Es requerido' } }
      };

      const resultadoValidacion = await validate(datos, constraintsGeneral);

      if (resultadoValidacion) throw new Error(resultadoValidacion[Object.keys(resultadoValidacion)[0]][0]);

      datos.idFlujo = req.params.idFlujo;
      datos.token = req.user.token;
      datos.fechaPlazo = req.body.fechaPlazo ? moment(req.body.fechaPlazo, 'DD-MM-YYYY').format('YYYY-MM-DD') : null;
      datos.userUpdated = req.user.idUsuario;
      datos.idUsuario = req.user.idUsuario;
      datos.generarCitePostergado = false;
      const respuesta = await FlujoDerivacionService.observacionDesvinculacion(datos);

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      console.log('ERROR OBSERVACION DESVINCULACION', error);
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function derivacionProveidoObservacion (req, res) {
    try {
      const datos = req.body;

      const constraintsGeneral = {
        clasificacion : { presence: { message: 'Es requerido' } },
        remitente     : { presence: { message: 'Es requerido' } },
        descripcion   : { presence: { message: 'Es requerido' } },
        idDocumento   : { presence: { message: 'Es requerido' } },
        idAccion      : { presence: { message: 'Es requerido' } },
        tipo          : { presence: { message: 'Es requerido' } },
        tipoFlujo     : { presence: { message: 'Es requerido' } }
      };

      const resultadoValidacion = await validate(datos, constraintsGeneral);

      if (resultadoValidacion) throw new Error(resultadoValidacion[Object.keys(resultadoValidacion)[0]][0]);

      if (app.aprobacionCiudadaniaDigital) await AuthService.verificarVigenciaAccessToken(req.user.token);

      datos.id = req.params.id;
      datos.token = req.user.token;
      datos.fechaPlazo = req.body.fechaPlazo ? moment(req.body.fechaPlazo, 'DD-MM-YYYY').format('YYYY-MM-DD') : null;
      datos.userUpdated = req.user.idUsuario;
      datos.idUsuario = req.user.idUsuario;
      datos.generarCitePostergado = false;

      const respuesta = await FlujoDerivacionService.derivacionProveidoObservacion(datos);

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      debug(error);
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function derivacionDerivarDocumento (req, res) {
    try {
      const datos = req.body;

      const constraintsGeneral = {
        clasificacion        : { presence: { message: 'Es requerido' } },
        remitente            : { presence: { message: 'Es requerido' } },
        destinatario         : { presence: { message: 'Es requerido' } },
        descripcion          : { presence: { message: 'Es requerido' } },
        idAccion             : { presence: { message: 'Es requerido' } },
        idPlantillaDocumento : { presence: { message: 'Es requerido' } },
        tipo                 : { presence: { message: 'Es requerido' } },
        tipoFlujo            : { presence: { message: 'Es requerido' } },
        idPaso               : { presence: { message: 'Es requerido' } }
      };

      const resultadoValidacion = await validate(datos, constraintsGeneral);

      if (resultadoValidacion) throw new Error(resultadoValidacion[Object.keys(resultadoValidacion)[0]][0]);

      if (app.aprobacionCiudadaniaDigital) await AuthService.verificarVigenciaAccessToken(req.user.token);

      datos.id = req.params.id;
      datos.token = req.user.token;
      datos.userUpdated = req.user.idUsuario;
      datos.idUsuario = req.user.idUsuario;
      datos.generarCitePostergado = true;

      const respuesta = await FlujoDerivacionService.derivacionDerivarDocumento(datos);

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      debug(error);
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function observacionPaso (req, res) {
    try {
      const datos = req.body;

      const constraintsGeneral = {
        clasificacion : { presence: { message: 'Es requerido' } },
        remitente     : { presence: { message: 'Es requerido' } },
        destinatario  : { presence: { message: 'Es requerido' } },
        descripcion   : { presence: { message: 'Es requerido' } },
        idAccion      : { presence: { message: 'Es requerido' } },
        tipo          : { presence: { message: 'Es requerido' } },
        tipoFlujo     : { presence: { message: 'Es requerido' } },
        idPaso        : { presence: { message: 'Es requerido' } },
        idDocumento   : { presence: { message: 'Es requerido' } }
      };

      const resultadoValidacion = await validate(datos, constraintsGeneral);

      if (resultadoValidacion) throw new Error(resultadoValidacion[Object.keys(resultadoValidacion)[0]][0]);

      if (app.aprobacionCiudadaniaDigital) await AuthService.verificarVigenciaAccessToken(req.user.token);

      datos.id = req.params.id;
      datos.token = req.user.token;
      datos.fechaPlazo = req.body.fechaPlazo ? moment(req.body.fechaPlazo, 'DD-MM-YYYY').format('YYYY-MM-DD') : null;
      datos.userUpdated = req.user.idUsuario;
      datos.idUsuario = req.user.idUsuario;
      datos.generarCitePostergado = false;

      const respuesta = await FlujoDerivacionService.observacionPaso(datos);

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      debug(error);
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function datosDerivacion (req, res) {
    try {
      let respuesta = await FlujoDerivacionService.datosDerivacion(req.params.id, req.user.idUsuario);
      
      if (respuesta?.flujoDocumental?.id) {
        // creacion de CITE
        if(respuesta?.flujoDocumental?.solicitudPlantilla?.docfisico && !respuesta.documento.cite){
          let idEntidad = respuesta.flujoDerivacion.usuarioDestinatario.idEntidad
          let { idUnidadOrganizacional } = await CargoService.findOne({ id: req.user.idCargo });
          let formulario = {...respuesta.documento.plantilla}
          if (!('permiteCiteDiferente' in formulario)) {
            formulario = await FormularioService.listarpor({ id: formulario.id });
          }
          if (formulario.permiteCiteDiferente) {
            idUnidadOrganizacional = formulario.idAreaCite;
            const unidadTemporal = await AreaService.findOne({ id: idUnidadOrganizacional });
            idEntidad = unidadTemporal.idEntidad
          }
          if (!formulario.postergarCite) {
            const citeDocumento = await CorrelativoService.generarCodigoDocumento(
              idEntidad,
              idUnidadOrganizacional,
              respuesta.documento.plantilla.id,
              respuesta.documento.plantilla.idCategoria,
              req.user.idUsuario,
              respuesta.documento.plantilla.citeInstitucional || false
            );    
            await DocumentoService.createOrUpdate({
              id             : respuesta.documento.id,
              cite           : citeDocumento,
              asunto         : respuesta.documento.asunto,
              fechaDocumento : new Date(),
              userCreated    : req.user.idUsuario
            }, false);
            respuesta.documento.cite = citeDocumento
          }
        }
        const flujoDocumental = await FlujoDocumentalService.findOne({ id: respuesta?.flujoDocumental?.id });
        const { clasificacion, flujoDerivaciones } = flujoDocumental;

        const participantes = new Set();
        for (const flujoDerivacion of flujoDerivaciones) {
          if (flujoDerivacion.idUsuarioRemitente) participantes.add(flujoDerivacion.idUsuarioRemitente);
          if (flujoDerivacion.idUsuarioDestinatario) participantes.add(flujoDerivacion.idUsuarioDestinatario);
        }

        if (clasificacion === CLASIFICACION_FLUJO.CONFIDENCIAL) {
          const tienePermiso = await AuthService.verificarPermisos({ roles: req.user.idRoles, permisos: ['ver:flujos:confidencial'] });

          if (!participantes.has(req.user.idUsuario) && !tienePermiso) {
            respuesta = {
              codigoFlujo   : flujoDocumental.codigoFlujo,
              estado        : flujoDocumental.estado,
              concluido     : flujoDocumental.concluido,
              clasificacion : 'CONDIFENCIAL'
            };
          }
        }
      }

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      console.log(error);
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function reasignacion (req, res) {
    try {
      req.body.userUpdated = req.user.idUsuario;

      const respuesta = await FlujoDerivacionService.reasignacion(req.body);

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      console.log(error);
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function eliminar (req, res) {
    try {
      const { id } = req.params;
      const { idUsuario } = req.user;
      const respuesta = await FlujoDerivacionService.deleteItem(id, idUsuario);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function modificarDerivacion (req, res) {
    try {
      const datos = {
        id          : req.params,
        ...req.body,
        userUpdated : req.user.idUsuario
      };
      const respuesta = await FlujoDerivacionService.modificarDerivacion(datos);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function limitePendientes  (req, res) {
    try {
      req.query.idUsuarioDestinatario = req.user.idUsuario;
      req.query.idCargoDestinatario = req.user.idCargo;

      const respuesta = await FlujoDerivacionService.limitePendientes(req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  return {
    modificarDerivacion,
    eliminar,
    reasignacion,
    listarBandejaReasignacion,
    observacionDesvinculacion,
    observacionNormal,
    observacionPaso,
    derivacionDerivarDocumento,
    derivacionProveidoObservacion,
    derivacionCrearDocumento,
    derivacionProveido,
    derivacionCerrar,
    derivacionArchivar,
    derivacionNormal,
    datosDerivacion,
    listarPendientesFirma,
    generarArobacionCiudadaniaUsuario,
    devolverAPendientes,
    observar,
    derivacionFinal,
    recepcionar,
    cantidades,
    listar,
    derivar,
    aprobacionCiudadania,
    actualizarEstado,
    limitePendientes
  };
};
