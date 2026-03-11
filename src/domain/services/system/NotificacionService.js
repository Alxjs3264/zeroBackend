'use strict';

const debug = require('debug')('app:service:auth');
const { config } = require('../../../common');
const { ErrorApp } = require('../../lib/error');
const axios = require('axios');
module.exports = function NotificacionService (repositories, helpers, res) {
  const { transaction } = repositories;
  const { CargoRepository } = repositories.planificacion;

  async function getMarcadosSRH ( nroDocumento, sigla, idCargo ) {
    try {
      const entidades = ['GSAJRPA','MJTI','CONALPEDIS']
      if (config.app.obtenerRegistrosSRH && entidades.includes(sigla)) {
        const cantidadDias = 5
        const addRetrasos = true
        const initStatus = {
          method  : 'GET',
          url     : `${config.app.servicios.srh.url}/api/public/datos-persona/${nroDocumento}/ultimos-marcados?limit=${cantidadDias}&retrasos=${addRetrasos ? 1 : 0}`,
          headers : { Authorization: `Bearer ${config.app.servicios.srh.iopToken || ''}`},
        };
        const { data } = await axios.request(initStatus)
        
        if (data?.datos?.puesto?.oficina) {          
          const cargo = await CargoRepository.findOne({ id: idCargo });
          if (!cargo.ciudad) {
            await CargoRepository.createOrUpdate({
              id : idCargo,
              ciudad : data.datos.puesto.oficina.lugarTrabajo
            })
          }
        }
        return data.datos
      } else {
        return {
          marcados : [],
          retrasos : null,
        }
      }
    } catch (err) {
      console.error('------------------------ ERROR SRH REQUEST ------------------------\n', err);
      throw new Error (`El servicio de SRH no se encuentra disponible`, 400);
    }
  }

  async function consentirNotificacion (params) {
    // '/notificacion/:id/concentimiento'
    const initStatus = {
      method  : 'PUT',
      url     : `${config.app.servicios.srh.url}/api/adm/notificacion/${params.idNotificacion}/consentimiento`,
      headers : { Authorization: `Bearer ${config.app.servicios.srh.iopToken || ''}` },
      data    : {
        ci: params.nroDocumento
      }
    };
    const { data } = await axios.request(initStatus);
    console.log('------------------------ NOTIFICACION SRH ------------------------\n', data);
    return data;
  }

  return {
    getMarcadosSRH,
    consentirNotificacion
  };
};
