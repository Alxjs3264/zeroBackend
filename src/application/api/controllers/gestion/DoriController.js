'use strict';
const debug = require('debug')('app:controller:componente');
const log = require('log4js').getLogger();
const { Respuesta } = require('../../../lib/respuesta');
const { Finalizado, HttpCodes } = require('../../../lib/globals');
const axios = require('axios');
const FormData = require('form-data');
const config = require('../../../../common/config');

module.exports = function setupComponenteController (services) {
  const { DoriService } = services;

  async function consultarCodigo (req, res) {
    try {
      const { codigo } = req.query;
      const urlDori = config.app.servicios.dori.url.replace('{codigoDori}', codigo);
      const init = {
        url     : urlDori,
        method  : 'GET',
        headers : {
          Authorization: `Bearer ${config.app.servicios.dori.token}`
        }
      };

      const { data: respuesta } = await axios(init);

      const ultimaDerivacion = respuesta.datos.flujoDocumento.pop();
      // R: realizado
      // P: pendiente
      // T: terminado

      if (ultimaDerivacion.estadoGeneral) {
        if (ultimaDerivacion.estadoGeneral !== 'P') throw new Error('La hoja de ruta ya fue finalizada en el sistema DORI');
      }

      // TODO: Verificacion de carnet

      const datos = {
        codigoFlujo    : respuesta.datos?.codHojaRuta,
        referencia     : respuesta.datos?.referenciaDoc,
        tipoFlujo      : respuesta.datos?.tipoReg === 'i' ? 'INTERNO' : 'EXTERNO',
        idFlujoPadre   : null,
        estado         : 'PENDIENTE',
        concluido      : false,
        idCarpeta      : null,
        proveidoCierre : null,
        areaRemitente  : respuesta.datos?.entidadRemitente,
        remitente      : respuesta.datos?.remitenteDoc,
        cargoRemitente : respuesta.datos?.cargoRemitente,
        migrado        : true
      };

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, datos));
    } catch (error) {
      if (error.response?.data) {
        return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(`Dori responde: ${error.response?.data?.mensaje}`, Finalizado.FAIL));
      }
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function superBuscadorDori (req, res) {
    try {
      if (req?.query?.codigo) {
        const data = await DoriService.consultarHR(req.query);
        const respuesta = {
          count : 1,
          rows  : [data]
        };
        return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
      } else {
        const respuesta = await DoriService.consultar(req.query);
        return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
      }
      // MJTI-DESP-JG-T-1145/2021
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  return {
    consultarCodigo,
    superBuscadorDori
  };
};
