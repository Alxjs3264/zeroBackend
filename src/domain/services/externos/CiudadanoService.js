'use strict';
const { config } = require('../../../common');
const { CODIGO_PARAMETRO_BANDEJA_CIUDADANO } = require('../../../common/config/constants');
const { ErrorApp } = require('../../lib/error');
const axios = require('axios');

module.exports = function CiudadanoService (repositories, helpers, res) {
  const { ParametroRepository, UsuarioRepository, RolUsuarioRepository, transaction } = repositories;

  async function estaHabilitadoBandejaCiudadano () {
    const existeParametro = await ParametroRepository.finOne({ codigo: CODIGO_PARAMETRO_BANDEJA_CIUDADANO, estado: 'ACTIVO' });
    return !!existeParametro;
  }

  async function usuarioHabilitado (idUsuario, t) {
    let transaccion;
    try {
      transaccion = t || await transaction.create();
      const existeUsuario = await UsuarioRepository.finOne({ id: idUsuario }, transaccion);

      if (!existeUsuario) throw new Error('No se pueden recuperar datos del usuario requerido.');

      if (!t) await transaction.commit(transaccion);

      return existeUsuario.estado === 'ACTIVO';
    } catch (error) {
      if (!t) await transaction.rollback(transaccion);
      return false;
    }
  }

  async function tieneRolCiudadano (idUsuario, t) {
    let transaccion;
    try {
      transaccion = t || await transaction.create();
      const rolesUsuario = await RolUsuarioRepository.findOne({ idUsuario }, transaccion);

      if (rolesUsuario)  return true;

      if (!t) await transaction.commit(transaccion);
      return true;
    } catch (error) {
      if (!t) await transaction.rollback(transaccion);
      return false;
    }
  }

  async function tieneCargoCiudadano (idUsuario, t) {
    let transaccion;
    try {
      transaccion = t || await transaction.create();

      if (!t) await transaction.commit(transaccion);
      return true;
    } catch (error) {
      if (!t) await transaction.rollback(transaccion);
      return false;
    }
  }

  async function habilitarCargoCiudadano (idUsuario, t) {
    const init = {
      method : 'GET',
      url    : `${config.app.notificaciones.BASE_URL}/public/status`
    };    
    try {
      const { data } = await axios(init);
      return data.finalizado;
    } catch (error) {
      return false;
    }
  }

  async function checkCiudadaniaStatus(iop = false) {
    let init;
    const verificar = config.app.verificarConexionIOP
    if (iop){
      const url = config.openid.aprobacion.url
      const match = url.match(/^https?:\/\/[^/]+/)
      const segmentoInicial = match ? match[0] : null
      init = {
        method: 'post',
        url: segmentoInicial.includes('ws.agetic.gob.bo') ? `${segmentoInicial}/ciudadania-digital/v1/status` : `${segmentoInicial}/fake/ciudadania-digital/v1/estado`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.openid.aprobacion.iopToken}`,
        }
      }
    } else {
      init = {
        method : 'GET',
        url    : 'https://www.gob.bo',
        timeout: 5000,
      }
    }
    try {
      if (verificar) await axios(init);
    } catch (error) {
      console.error(error)
      if (error.code === 'ECONNABORTED') {
        throw new Error('No se puede conectar con la AGETIC.')
      }
      throw error
    }
  }

  return {
    estaHabilitadoBandejaCiudadano,
    usuarioHabilitado,
    tieneRolCiudadano,
    tieneCargoCiudadano,
    habilitarCargoCiudadano,
    checkCiudadaniaStatus
  };
};
