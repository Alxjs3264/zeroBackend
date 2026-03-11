'use strict';

const debug = require('debug')('app:service:auth');
const { config } = require('../../../common');
const { ErrorApp } = require('../../lib/error');
const axios = require('axios');
const crypto = require('crypto');
module.exports = function NotificacionService (repositories, helpers, res) {
  const { transaction } = repositories;
  const { CargoRepository } = repositories.planificacion;

  function prepareService (method, query, condition, sort = null, params = {}) {
    const osTicketService = config.app.servicios.osTicket

    const initStatus = {
      method  : method,
      url     : osTicketService.url,
      headers : {
        'Content-Type': 'application/json',
        'apikey': osTicketService.token
      }
    };

    const body = {
      query,
      condition,
      sort,
      client: "ZERO"
    };
    if (Object.entries(params).length > 0) {
      body.parameters = { ...params }
    }

    // if (method === 'GET') {
    //   initStatus.params = body;
    // } else {
    //   initStatus.data = body;
    // }
    initStatus.data = body;
    return initStatus
  }

  async function getDepartamentos () {
    const initStatus = prepareService('GET', 'department', 'all', 'creationDate');
    try {
      const { data } = await axios.request(initStatus);
      return {
        rows: data?.data?.departments ?? [],
        count: data?.data?.total ?? 0
      };
    } catch (err) {
      throw err;
    }
  }

  async function getTopicos () {
    const initStatus = prepareService('GET', 'topics', 'all');
    try {
      const { data } = await axios.request(initStatus);
      return {
        rows: data?.data?.topics ?? [],
        count: data?.data?.total ?? 0
      };
    } catch (err) {
      throw err;
    }
  }
  async  function getPrioridades () {
    const initStatus = prepareService('GET', 'ticket', 'priority');
    try {
      const { data } = await axios.request(initStatus);
      return {
        rows: data?.data?.priorities ?? [],
        count: data?.data?.total ?? 0
      };
    } catch (err) {
      throw err;
    }
  }

  async  function getUnidades () {
    const initStatus = prepareService('GET', 'lista', 'specific', 'id', { id: 3 });
    try {
      const { data } = await axios.request(initStatus);
      return data?.data?.total === 1 ? data?.data?.lists[0] : null;
    } catch (err) {
      throw err;
    }
  }
  async  function getEntidades () {
    const initStatus = prepareService('GET', 'lista', 'specific', 'id', { id: 2 });
    try {
      const { data } = await axios.request(initStatus);
      return data?.data?.total === 1 ? data?.data?.lists[0] : null;
    } catch (err) {
      throw err;
    }
  }

  async function getUsuarios (username, single = false) {
    const initStatus = prepareService('GET', 'user', 'specific', 'nro_ci', { nro_ci: username });
    try {
      const { data } = await axios.request(initStatus);
      
      if (single) {
        return data?.data?.total > 0 ? data?.data?.users[0] : null
      } else {
        return {
          rows: data?.data?.users ?? [],
          count: data?.data?.total ?? 0
        };
      }
    } catch (err) {
      throw err;
    }
  }

  async function addTicket (data) {
    const initStatus = prepareService('POST', 'ticket', 'add', null, data);
    try {
      const res = await axios.request(initStatus)
      console.log(res);
      const { data } = res
      if (data.status === 'Error') {
        throw new Error(data.data)
      } else {
        return data.data
      }
      return data;
    } catch (err) {
      throw err;
    }
  }

  async function addUser (data) {
    const initStatus = prepareService('POST', 'user', 'add', null, data);
    try {
      const { data } = await axios.request(initStatus)
      
      if (data.status === 'Error') {
        throw new Error(data.data)
      } else {
        return data.data
      }
    } catch (err) {
      throw err;
    }
  }

  async function obtenerUrlLogin (uuid) {
    const osTicketService = config.app.servicios.osTicket
    
    const ts = Math.floor(Date.now() / 1000); // Timestamp actual en segundos

    const message = `${uuid}|${ts}`;
    const token = crypto.createHmac('sha256', osTicketService.secret).update(message).digest('hex');

    const autologinUrl = `${osTicketService.url}../api.auth.php?uuid=${uuid}&ts=${ts}&token=${token}`;

    return {
      url: autologinUrl
    }
  }

  return {
    getDepartamentos,
    getTopicos,
    getPrioridades,
    getUsuarios,
    getUnidades,
    getEntidades,
    addTicket,
    addUser,
    obtenerUrlLogin
  };
};
