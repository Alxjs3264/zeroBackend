'use strict';

const debug = require('debug')('app:service:rol');
const axios = require('axios');
const { servicios } = require('../../../common/config/app');

module.exports = function rolService (repositories, helpers, res) {
  const { DocumentoRepository } = repositories;

  async function solicitarNotificacionTramite (datos) {
    try {
      if (!servicios.notificacion.url || !servicios.notificacion.iopToken) throw new Error('Error en configuración de notificaciones de Ciudadanía');

      const resp = await axios({
        url     : servicios.notificacion.url,
        method  : 'POST',
        headers : {
          Authorization: `Bearer ${servicios.notificacion.iopToken || ''}`
        },
        data: {
          delegado  : datos.delegado,
          proceso   : datos.proceso,
          objeto    : datos.objeto,
          asunto    : datos.asunto,
          contenido : datos.contenido,
          tramite   : datos.idTramite,
          autoridad : {
            numeroDocumento : datos.autoridad.numeroDocumento,
            fechaNacimiento : datos.autoridad.fechaNacimiento,
            complemento     : datos.autoridad.complementoDocumento || ''
          },
          notificado: {
            numeroDocumento : datos.notificado.numeroDocumento,
            fechaNacimiento : datos.notificado.fechaNacimiento,
            complemento     : datos.notificado.complementoDocumento || ''
          },
          enlaces: datos.enlaces.map(x => ({ label: x.label, url: x.url, tipo: x.tipo }))
        }
      });

      return resp?.data;
    } catch (error) {
      console.error('ERROR SOLICITUD NOTIFICACION:', error.response && error.response.data);
      throw new Error(error.message);
    }
  }

  async function cierreNotificacionTramite (datos, voucher) {
    try {
      if (!servicios.notificacion.url || !servicios.notificacion.iopToken) throw new Error('Error en configuración de notificaciones de Ciudadanía');
      const resp = await axios({
        method  : 'PATCH',
        url     : `${servicios.notificacion.url}/${voucher}`,
        headers : {
          Authorization: `Bearer ${servicios.notificacion.iopToken || ''}`
        },
        data: {
          idHash          : datos.idHash,
          certificado     : datos.certificado,
          cadenaConfianza : datos.cadenaConfianza,
          encriptacion    : 'RSA',
          firma           : {
            algoritmo : 'RSA_SHA256',
            id        : datos.firma.id,
            valor     : datos.firma.valor
          }
        },
        responseType: 'application/json'
      });
      return resp.data;
    } catch (error) {
      console.error('ERROR CIERRE NOTIFICACION:', error.response && error.response.data);
      throw new Error(error.message);
    }
  }

  return {
    solicitarNotificacionTramite,
    cierreNotificacionTramite
  };
};
