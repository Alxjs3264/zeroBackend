
'use strict';
const debug = require('debug')('app:controller:componente');
const { Respuesta } = require('../../../lib/respuesta');
const { Finalizado, HttpCodes } = require('../../../lib/globals');

module.exports = function setupComponenteController (services) {
  const { PasoService, DocumentoService, SolicitudEjecucionService, FlujoDerivacionService, EjecucionInteroperabilidadService, UsuarioService } = services;

  async function findAll (req, res) {
    try {
      const respuesta = await PasoService.findAll(req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }
  async function listarpor (req, res) {
    try {
      const data = req.body;
      data.id = req.params.id;
      const respuesta = await PasoService.findOne(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }
  async function crear (req, res) {
    try {
      const data = req.body;
      debug('creando componente');
      data.userCreated = req.user.idUsuario; // corregir
      const respuesta = await PasoService.createOrUpdateCompleto(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function actualizar (req, res) {
    try {
      const data = req.body;
      debug('actualizando componente');
      data.id = req.params.id;
      data._user_updated = req.user.idUsuario;
      const respuesta = await PasoService.createOrUpdate(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function eliminar (req, res) {
    try {
      const { id } = req.params;
      debug('Eliminando componente');
      const respuesta = await PasoService.deleteItem(id);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function ejecutarInteroperabilidadPresupuesto (req, res) {
    try {
      const data = {
        idDocumento         : req.body.idDocumento,
        idInteroperabilidad : req.body.idInteroperabilidad,
        configuracionJson   : req.body.configuracionJson,
        userCreated         : req.user.idUsuario
      };
      const documento = await DocumentoService.findOne({ id: data.idDocumento });
      if (!documento) throw new Error('No existe el documento especificado');
      let existeComponenteIop = {};
      if (!req.body.sinGuardadoPlantilla) existeComponenteIop = documento.plantilla?.configuracion_json.find(x => x.uid === data.idInteroperabilidad);
      else existeComponenteIop = data.configuracionJson.find(x => x.uid === data.idInteroperabilidad);
      if (!existeComponenteIop) throw new Error('No existe el componente de interoperabilidad.');
      documento.plantilla.configuracion_json = data.configuracionJson;
      const respuesta = await PasoService.ejecutarInteroperabilidad(
        existeComponenteIop.configuracion.interoperabilidad[req.body.configuracion],
        documento,
        !req.body.sinGuardadoPlantilla);
      if (!req.body.sinGuardadoPlantilla) {
        for (const componente of respuesta) {
          if (componente.uid === existeComponenteIop.uid) componente.ejecutado = true;
        }
        const plantillaFinal = documento.plantilla;
        plantillaFinal.configuracion_json = respuesta;
        await DocumentoService.createOrUpdate({ id: documento.id, plantilla: plantillaFinal }, false);
      }
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function ejecutarInteroperabilidad (req, res) {
    try {
      const data = {
        idDocumento         : req.body.idDocumento,
        idInteroperabilidad : req.body.idInteroperabilidad,
        configuracionJson   : req.body.configuracionJson,
        userCreated         : req.user.idUsuario
      };
      const documento = await DocumentoService.findOne({ id: data.idDocumento });

      if (!documento) throw new Error('No existe el documento especificado');

      const existeComponenteIop = documento.plantilla?.configuracion_json.find(x => x.uid === data.idInteroperabilidad);

      if (!existeComponenteIop) throw new Error('No existe el componente de interoperabilidad.');

      documento.plantilla.configuracion_json = data.configuracionJson;
      const respuesta = await PasoService.ejecutarInteroperabilidad(existeComponenteIop.configuracion, documento, req.body.configuracionJson.sinGuardadoPlantilla);
      if (!req.body.configuracionJson.sinGuardadoPlantilla) {
        for (const componente of respuesta) {
          if (componente.uid === existeComponenteIop.uid) componente.ejecutado = true;
        }
        const plantillaFinal = documento.plantilla;
        plantillaFinal.configuracion_json = respuesta;
        await DocumentoService.createOrUpdate({ id: documento.id, plantilla: plantillaFinal }, false);
      }
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function getDatosUsuario (idUsuario) {
    const usuario = await UsuarioService.mostrar(idUsuario);
    if (!usuario) throw new Error('El usuario no existe');
    return {
      id      : usuario.id,
      nombre  : `${usuario.nombres} ${usuario.primerApellido} ${usuario.segundoApellido}`,
      idCargo : usuario.cargoUsuario?.id,
      cargo   : usuario.cargoUsuario.descripcion

    };
  }

  async function ejecucionInteroperabilidad (req, res) {
    try {
      const paso = await PasoService.findOne({ id: req.params.id });

      if (!paso) throw new Error('El paso de interoperabilidad no se encuentra o no existe.');

      const { configuracion } = paso;

      const respuestaIop = await PasoService.evaluarConfiguracionInteroperabilidad(req.body.idFlujo, configuracion.envio, configuracion.respuesta);

      await EjecucionInteroperabilidadService.createOrUpdate({
        idPaso      : req.params.id,
        idFlujo     : req.body.idFlujo,
        ...respuestaIop,
        userCreated : req.user.idUsuario
      });

      const { pasosSiguientes } = paso;

      const datosPaso = await SolicitudEjecucionService.getConfiguracionPaso(pasosSiguientes[0].pasoSiguiente, req.user.idUsuario, req.body.idFlujo);

      const datosDerivacion = {
        id                   : req.body.idDerivacion,
        clasificacion        : { motivo: null, tipo: 'ABIERTO' },
        descripcion          : 'El intercambio de informacion fue exitoso.',
        externo              : null,
        fechaPlazo           : null,
        idAccion             : datosPaso.idAccion,
        idPaso               : pasosSiguientes[0].pasoSiguiente?.id,
        idPlantillaDocumento : datosPaso.idFormulario,
        migracion            : false,
        observacion          : false,
        tipo                 : 'REMITENTE',
        tipoSiguiente        : datosPaso.tipo,
        remitente            : await getDatosUsuario(req.user.idUsuario),
        destinatario         : await getDatosUsuario(datosPaso.usuariosDerivacion[0].idUsuario),
        userUpdated          : req.user.idUsuario,
        idUsuario            : req.user.idUsuario
      };

      // await FlujoDerivacionService.createOrUpdate(datosDerivacion);

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, {}));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  return {
    ejecucionInteroperabilidad,
    ejecutarInteroperabilidad,
    ejecutarInteroperabilidadPresupuesto,
    findAll,
    listarpor,
    eliminar,
    actualizar,
    crear
  };
};
