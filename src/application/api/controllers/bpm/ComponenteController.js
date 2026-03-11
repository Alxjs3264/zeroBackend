
'use strict';
const debug = require('debug')('app:controller:componente');
const { Respuesta } = require('../../../lib/respuesta');
const { Finalizado, HttpCodes } = require('../../../lib/globals');

module.exports = function setupComponenteController (services) {
  const { ComponenteService, DocumentoService } = services;

  async function listar (req, res) {
    try {
      const respuesta = await ComponenteService.listar(req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }
  async function listarpor (req, res) {
    try {
      const data = req.body;
      data.id = req.params.id;
      const respuesta = await ComponenteService.findOne(data);
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
      const respuesta = await ComponenteService.createOrUpdateCompleto(data);
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
      const respuesta = await ComponenteService.createOrUpdate(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function eliminar (req, res) {
    try {
      const { id } = req.params;
      debug('Eliminando componente');
      const respuesta = await ComponenteService.deleteItem(id);
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
      const respuesta = await ComponenteService.ejecutarInteroperabilidad(
        existeComponenteIop.configuracion.interoperabilidad[req.body.configuracion],
        documento,
        !req.body.sinGuardadoPlantilla, req.user.idUsuario);
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
      existeComponenteIop.configuracion.idComponente = data.idInteroperabilidad;
      const respuesta = await ComponenteService.ejecutarInteroperabilidad(existeComponenteIop.configuracion, documento, true, req.user.idUsuario);
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

  return {
    ejecutarInteroperabilidad,
    ejecutarInteroperabilidadPresupuesto,
    listar,
    listarpor,
    eliminar,
    actualizar,
    crear
  };
};
