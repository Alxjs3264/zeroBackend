'use strict';

const debug = require('debug')('app:service:componente');
const { TIPO_PASO } = require('../../../common/config/constants');
const { ErrorApp } = require('../../lib/error');
const axios = require('axios');
const _ = require('lodash');

module.exports = function componenteService (repositories, helpers, res) {
  const { PasoRepository, DocumentoRepository, ServicioRepository, EjecucionInteroperabilidadRepository, transaction } = repositories;

  async function findAll (params) {
    try {
      const respuesta = [];
      const pasos = await PasoRepository.findAll(params);

      for (const paso of pasos.rows) {
        if (paso.tipo === TIPO_PASO.FORMULARIO && paso.formulario) respuesta.push(getCamposFormulario(paso));

        if (paso.tipo === TIPO_PASO.INTEROPERABILIDAD) respuesta.push(getCamposInteroperabilidad(paso));

        if (params.pasoSinFormulario) {
          if (paso.tipo === TIPO_PASO.INICIO)  {
            respuesta.push({
              idPaso     : paso.id,
              formulario : paso.formulario?.nombre,
              id         : paso.formulario?.id,
              clase      : 'text-weight-bold text-positive bg-green-1',
              icono      : 'flag',
              colorIcono : 'positive',
              tipo       : TIPO_PASO.INICIO.toUpperCase(),
              nombre     : paso.nombrePaso,
              campos     : []
            });
          }

          if ([TIPO_PASO.FIN, TIPO_PASO.FALLO].includes(paso.tipo))  {
            respuesta.push({
              idPaso     : paso.id,
              formulario : paso.formulario?.nombre,
              id         : paso.formulario?.id,
              clase      : 'text-weight-bold text-negative bg-red-1',
              icono      : 'sports_score',
              colorIcono : 'negative',
              tipo       : TIPO_PASO[paso.tipo.toUpperCase()].toUpperCase(),
              nombre     : paso.nombrePaso,
              campos     : []
            });
          }
        }
      }
      return respuesta;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  function getCamposFormulario (paso) {
    const camposNativos = ['Id del documento', 'id del Flujo', 'Cite', 'Hoja de ruta', 'Fecha del documento', 'Clasificacion', 'Fecha de creacion', 'Estado del documento', 'Estado del Flujo', 'Usuario actual'];
    const datosFormulario = {
      idPaso     : paso.id,
      formulario : paso.formulario?.nombre,
      id         : paso.formulario.id,
      clase      : 'text-weight-bold text-info bg-blue-1',
      icono      : 'description',
      colorIcono : 'info',
      tipo       : TIPO_PASO.FORMULARIO.toUpperCase(),
      nombre     : paso.nombrePaso,
      campos     : []
    };

    for (const campo of camposNativos) {
      datosFormulario.campos.push({
        idPlantilla     : paso.formulario.id,
        nombrePlantilla : paso.nombrePaso,
        sigla           : paso.formulario?.sigla,
        id              : `${paso.formulario.id}-${campo}`,
        name            : campo,
        type            : 'NATIVO',
        subCampo        : 'value'
      });
    }

    for (const campo of paso.formulario.configuracion_json) {
      if (campo.subCampos) {
        for (const subCampo of campo.subCampos) {
          datosFormulario.campos.push({
            idPaso          : paso.id,
            idPlantilla     : paso.formulario.id,
            nombrePlantilla : paso.nombrePaso,
            sigla           : paso.formulario?.sigla,
            id              : campo.uid,
            name            : campo.name,
            type            : 'FORMULARIO',
            subCampo        : subCampo
          });
        }
      } else {
        datosFormulario.campos.push({
          idPaso          : paso.id,
          idPlantilla     : paso.formulario.id,
          nombrePlantilla : paso.nombrePaso,
          sigla           : paso.formulario?.sigla,
          id              : campo.uid,
          name            : campo.name,
          type            : 'FORMULARIO',
          subCampo        : 'value'
        });
      }
    }

    return datosFormulario;
  }

  function getCamposInteroperabilidad (paso) {
    const datosInteroperabilidad = {
      idPaso     : paso.id,
      formulario : null,
      id         : paso.id,
      clase      : 'text-weight-bold text-positive bg-green-1',
      icono      : 'cloud_upload',
      colorIcono : 'positive',
      tipo       : TIPO_PASO.INTEROPERABILIDAD.toUpperCase(),
      nombre     : paso.nombrePaso,
      campos     : []
    };

    for (const campo of paso.configuracion.respuesta) {
      datosInteroperabilidad.campos.push({
        idPaso          : paso.id,
        idPlantilla     : paso.id,
        nombrePlantilla : paso.nombrePaso,
        sigla           : 'IOP',
        id              : campo.path,
        name            : campo.path,
        type            : 'INTEROPERABILIDAD',
        subCampo        : 'value'
      });
    }
    return datosInteroperabilidad;
  }

  async function findOne (params) {
    try {
      const comentario = await PasoRepository.findOne(params);
      if (!comentario) {
        throw new Error('El paso no existe');
      }
      return comentario;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function createOrUpdate (data) {
    debug('Crear o actualizar componente');
    let componente;
    try {
      componente = await PasoRepository.createOrUpdate(data);
      return componente;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }
  async function createOrUpdateCompleto (data) {
    let transaccion;
    try {
      transaccion = await transaction.create();
      const componenteCreado = await PasoRepository.createOrUpdate(data, transaccion);

      if (data.entidades) {
        if (data.entidades.length === 0) throw new Error('Debe asignar al menos una entidad al Componente');
      }
      await transaction.commit(transaccion);
      return componenteCreado;
    } catch (error) {
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function deleteItem (id) {
    debug('Eliminando componente', id);
    try {
      const resultado = await PasoRepository.deleteItem(id);
      return resultado;
    } catch (err) {
      debug(err);
      throw new ErrorApp(err.message, 400);
    }
  }

  function getValorCampo (campos, regla, documento) {
    if (regla.estatico) {
      try {
        return JSON.parse(regla.campo);
      } catch {
        return regla.campo;
      }
    }

    if (regla.campo?.type === 'NATIVO') {
      const nombreCampo = regla.campo?.name.toUpperCase();
      console.log('==========_DESDE_DOCUMENTO_==========');
      console.log(documento);
      console.log('==========_DESDE_DOCUMENTO_==========');
      if (nombreCampo === 'HOJA DE RUTA') return 113;
      if (nombreCampo === 'CITE') return documento.cite;
      if (nombreCampo === 'FECHA DOCUMENTO') return documento.fechaDocumento;
      if (nombreCampo === 'NOMBRE DEL FORMULARIO') return documento.plantilla?.nombre;
      if (nombreCampo === 'SIGLA DEL FORMULARIO') return documento.plantilla?.sigla;
    }

    const existeComponente = campos.find(x => x.uid === regla.campo.id);

    if (!existeComponente) return null;
    if (existeComponente.typeInput === 'derivacion') {
      if (regla.campo?.subCampo !== 'value' && regla.campo?.subCampo?.includes('invertir')) {
        return existeComponente.value.valores[regla.campo?.subCampo?.replace('invertir', '')].reverse();
      }
      if (regla.campo?.subCampo !== 'value') {
        return existeComponente.value.valores[regla.campo?.subCampo];
      }
      return existeComponente.value?.valores;
    }

    if (['presupuesto', 'eventual'].includes(existeComponente.typeInput)) {
      if (regla.campo.subCampo !== 'value') {
        if (regla.campo.subCampo === 'operacion') {
          const n = existeComponente.value.valores.detalles.map(e => e.operacion);
          return [...new Map(n.map(item =>
            [item.id, item])).values()];
        }
        if (regla.campo.subCampo === 'idSolicitud') {
          return existeComponente.value?.valores?.id;
        }
      }
      return existeComponente.value?.valores;
    }
    if (existeComponente.typeInput === 'diaViaticos') {
      if (regla.campo.subCampo === 'value') {
        return existeComponente.value?.valores;
      } else {
        return existeComponente.value?.valores[regla.campo.subCampo];
      }
    }
    if (existeComponente.typeInput === 'pagoDetalle') {
      if (regla.campo.subCampo === 'value') {
        return existeComponente.value?.valores;
      } else {
        if (regla.valorOrigen === 'item') {
          return existeComponente.value?.valores.consolidado;
        }
        return existeComponente.value?.valores[regla.campo.subCampo];
      }
    }
    if (existeComponente.typeInput === 'pagoDivididos') {
      if (regla.campo.subCampo === 'value') {
        return existeComponente.value?.valores;
      } else {
        return existeComponente.value?.valores[regla.campo.subCampo];
      }
    }
    if (existeComponente.typeInput === 'funcionario') {
      switch (regla.campo.subCampo) {
        case 'tipoDocumento':
          return existeComponente.value?.valores?.usuario?.tipoDocumento;
        case 'documento':
          return existeComponente.value?.valores?.usuario?.numeroDocumento;
        case 'complemento':
          return existeComponente.value?.valores?.usuario?.complemento;
        case 'fechaNacimiento':
          return existeComponente.value?.valores?.usuario?.fechaNacimiento;
        case 'nombres':
          return existeComponente.value?.valores?.usuario?.nombres;
        case 'primerApellido':
          return existeComponente.value?.valores?.usuario?.primerApellido;
        case 'segundoApellido':
          return existeComponente.value?.valores?.usuario?.segundoApellido;
        case 'item':
          return existeComponente.value?.valores?.cargo?.nroItem;
        case 'cargo':
          return existeComponente.value?.valores?.cargo?.descripcion;
        case 'usuario':
          return existeComponente.value?.valores?.usuario?.usuario;
        case 'area':
          return existeComponente.value?.valores?.cargo?.unidad?.nombreArea;
        case 'idUnidad':
          return existeComponente.value?.valores?.cargo?.unidad?.id;
        case 'nivel':
          return existeComponente.value?.valores?.cargo?.nivel;
        case 'celular':
          return existeComponente.value?.valores?.usuario?.celular;
        case 'telefono':
          return existeComponente.value?.valores?.usuario?.telefono;
        case 'correoElectronico':
          return existeComponente.value?.valores?.usuario?.correoElectronico;
        default:
          return existeComponente.value?.valores;
      }
    }

    // TODO: Adicionar tipos de componentes especificos.
    if (existeComponente.typeInput !== 'derivacion') {
      return existeComponente.value?.valores;
    }
  }

  async function getValue (idFlujo, campoOrigen) {
    let documento = { plantilla: { configuracion_json: [] } };
    let valor = null;

    if (campoOrigen.campo?.type === 'FORMULARIO') {
      const respuestaDocumento = await DocumentoRepository.findOne({ idFlujo, plantilla: { id: campoOrigen.campo?.idPlantilla } });
      if (respuestaDocumento) documento = respuestaDocumento;
      valor = getValorCampo(documento.plantilla.configuracion_json, campoOrigen, documento);
    }

    if (campoOrigen.campo?.type === 'INTEROPERABILIDAD') {
      const respuestaIop = await EjecucionInteroperabilidadRepository.findOne({ idFlujo, idPaso: campoOrigen.campo?.idPlantilla });
      if (respuestaIop) valor = respuestaIop[campoOrigen.campo];
    }

    return valor;
  }

  async function evaluarConfiguracionInteroperabilidad (idFlujo, envio, respuesta) {
    async function ejecutarReglaIOPBody (regla, data) {
      data[regla.campoDestino.campo] = await getValue(idFlujo, regla.campoOrigen);
    }

    async function ejecutarReglaIOPHeader (regla, headers) {
      headers[regla.campoDestino.campo] = await getValue(idFlujo, regla.campoOrigen);
    }

    try {
      const _existeServicio = await ServicioRepository.findOne({ id: envio.idServicio });

      if (!_existeServicio) throw new Error('No existe el servicio solicitado.');

      const initStatus = {
        method  : 'GET',
        url     : `${_existeServicio.urlBase}${_existeServicio.urlStatus}`,
        headers : { Authorization: _existeServicio.token }
      };

      try {
        await axios(initStatus);
      } catch (error) {
        throw new ErrorApp(`El servicio de ${_existeServicio.nombre} no se encuentra disponible`, 400);
      }

      const init = {
        url     : `${_existeServicio.urlBase}${_existeServicio.urlServicio}`,
        method  : _existeServicio.metodo,
        headers : { Authorization: _existeServicio.token },
        data    : {}
      };

      for (const body of envio.body) {
        await ejecutarReglaIOPBody(body, init.data);
      }

      for (const header of envio.headers) {
        await ejecutarReglaIOPHeader(header, init.headers);
      }

      const queries = [];
      for (const parametro of envio.parametros) {
        if (parametro.campoDestino.tipo === 'RUTA') {
          const valor = await getValue(idFlujo, parametro.campoOrigen);
          init.url = init.url.replace(parametro.campoDestino.campo, valor);
        }
        if (parametro.campoDestino.tipo === 'CONSULTA') {
          const valor = await getValue(idFlujo, parametro.campoOrigen);
          queries.push(`${parametro.campoDestino.campo}=${valor}`);
        }
      }

      if (queries.length > 0) init.url = `${init.url}?${queries.join('&')}`;

      try {
        const { data } = await axios(init);
        const respuestaFormateado = {};
        for (const resp of respuesta) {
          respuestaFormateado[resp.path] = _.get(data, resp.path);
        }

        return { envio: init, respuesta: data, respuestaFormateado };
      } catch (error) {
        throw new ErrorApp(`IOP: ${error?.response?.data?.mensaje}` || 'Error al consumir el servicio', 400);
      }
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  return {
    evaluarConfiguracionInteroperabilidad,
    findOne,
    findAll,
    createOrUpdate,
    createOrUpdateCompleto,
    deleteItem
  };
};
