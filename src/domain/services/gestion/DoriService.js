const axios = require('axios');
const FormData = require('form-data');
const https = require('https');
const config = require('../../../common/config');

module.exports = function doriService () {
  async function consultarHR (params) {
    try {
      const estado = {
        P : 'PENDIENTE',
        R : 'REALIZADO',
        T : 'FINALIZADO'
      };
      const urlDori = config.app.servicios.dori.url.replace('{codigoDori}', params.codigo);
      console.log(urlDori);
      const init = {
        url     : urlDori,
        method  : 'GET',
        headers : {
          Authorization: `Bearer ${config.app.servicios.dori.token}`
        }
      };
      const { data: respuesta } = await axios(init);
      const flujo = respuesta.datos.flujoDocumento;
      const ultimaDerivacion = respuesta.datos.flujoDocumento[respuesta.datos.flujoDocumento.length - 1];
      // R: realizado
      // P: pendiente
      // T: terminado
      /* if (ultimaDerivacion.estadoGeneral) {
        if (ultimaDerivacion.estadoGeneral !== 'P') throw new Error('La hoja de ruta ya fue finalizada en el sistema DORI');
      } */
      // TODO: Verificacion de carnet
      const datos = {
        codigoFlujo    : respuesta.datos?.codHojaRuta,
        referencia     : respuesta.datos?.referenciaDoc,
        tipoFlujo      : respuesta.datos?.tipoReg === 'i' ? 'INTERNO' : 'EXTERNO',
        idFlujoPadre   : null,
        estado         : ultimaDerivacion?.estadoGeneral && estado[ultimaDerivacion?.estadoGeneral] ? estado[ultimaDerivacion?.estadoGeneral] : 'NO ENVIADO',
        concluido      : false,
        idCarpeta      : null,
        proveidoCierre : null,
        areaRemitente  : respuesta.datos?.entidadRemitente,
        remitente      : respuesta.datos?.remitenteDoc,
        cargoRemitente : respuesta.datos?.cargoRemitente,
        migrado        : true,
        flujo          : flujo
      };
      return datos;
    } catch (error) {
      if (error.response?.data) {
        throw new Error(`Dori responde: ${error.response?.data?.mensaje}`);
      }
      throw new Error(error.message);
    }
  }
  async function consultar (params) {
    try {
      const { fecha, cite, limit, page } = params;
      const init = (limit * (page - 1)) + 1 || 1;
      const end = init + parseInt(limit) || 11;
      console.log(init);
      console.log(end);
      const form = new FormData();
      if (fecha) {
        form.append('fecha_bus', fecha);
      }
      if (cite) {
        form.append('cite_bus', cite);
      }
      const headers = form.getHeaders();
      headers.Cookie = `PHPSESSID=${config.app.cookieDori}`;
      const { data: respuesta } = await axios.post(
        config.app.doriUrlSuperBuscador, form, {
          headers: headers
        });
      const data = respuesta.replace(/(\r\n|\n|\r|\t)/gm, '');
      if (data.includes('Registros encontrados')) {
        const body = data.split('<tbody>')[1];
        const rows = body.replaceAll('<tr>', '|').replaceAll('</tr>', '|').replaceAll('||', '|').split('|');
        const result = {
          count : rows.length - 2,
          rows  : []
        };
        for (let index = init; index < end; index++) {
          let row = rows[index];
          row = row.replaceAll('<td>', '|');
          row = row.replaceAll('</td>', '|');
          row = row.replaceAll('||', '|');
          const cols = row.split('|');
          try {
            const data = await consultarHR({ codigo: cols[1] });
            result.rows.push(data);
          } catch (_) {
            result.rows.push({
              codigoFlujo    : cols[1],
              referencia     : cols[5],
              tipoFlujo      : cols[2].toUpperCase(),
              idFlujoPadre   : null,
              estado         : 'SIN ESTADO',
              concluido      : false,
              idCarpeta      : null,
              proveidoCierre : null,
              areaRemitente  : cols[4],
              remitente      : cols[3],
              cargoRemitente : '',
              migrado        : false
            });
          }
        }
        return result;
      } else {
        return [];
      }
    } catch (error) {
      if (error.response?.data) {
        throw new Error(`Dori responde: ${error.response?.data?.mensaje}`);
      }
      throw new Error(error.message);
    }
  }
  return {
    consultarHR,
    consultar
  };
};
