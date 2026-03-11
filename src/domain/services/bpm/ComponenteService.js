'use strict';

const debug = require('debug')('app:service:componente');
const { config } = require('../../../common');
const { ErrorApp } = require('../../lib/error');
const axios = require('axios');
const _ = require('lodash');
const DocumentoService = require('../gestion/DocumentoService');

module.exports = function componenteService (repositories, helpers, res) {
  const { ComponenteRepository, ServicioRepository, DocumentoRepository, UsuarioRepository, EjecucionInteroperabilidadRepository, transaction } = repositories;

  async function listar (params) {
    try {
      const comentarios = await ComponenteRepository.findAll(params);
      return comentarios;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function findOne (params) {
    try {
      const comentario = await ComponenteRepository.findOne(params);
      if (!comentario) {
        throw new Error('El comentario no existe');
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
      componente = await ComponenteRepository.createOrUpdate(data);
      return componente;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function createOrUpdateCompleto (data) {
    let transaccion;
    try {
      transaccion = await transaction.create();
      const componenteCreado = await ComponenteRepository.createOrUpdate(data, transaccion);

      if (data.entidades)  if (data.entidades.length === 0) throw new Error('Debe asignar al menos una entidad al Componente');

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
      const resultado = await ComponenteRepository.deleteItem(id);
      return resultado;
    } catch (err) {
      debug(err);
      throw new ErrorApp(err.message, 400);
    }
  }

  async function getValorCampo (campos, regla, documento, userId = null) {
    if (regla.estatico) {
      try {
        return JSON.parse(regla.valorOrigen);
      } catch {
        return regla.valorOrigen;
      }
    }

    if (regla.campo?.type === 'METADATA') {
      if (regla.campo?.name === 'HOJA DE RUTA') return documento?.flujoDocumental?.codigoFlujo;
      if (regla.campo?.name === 'CITE') return documento.cite;
      if (regla.campo?.name === 'FECHA DEL DOCUMENTO') return documento.fechaDocumento;
      if (regla.campo?.name === 'NOMBRE DEL FORMULARIO') return documento.plantilla?.nombre;
      if (regla.campo?.name === 'SIGLA DEL FORMULARIO') return documento.plantilla?.sigla;
      if (regla.campo?.name === 'USUARIO ACTUAL') {
        const usuario = await UsuarioRepository.findOne({ id: userId });
        return usuario;
      }
    }

    const existeComponente = campos.find(x => x.uid === regla.campoOrigen);
    if (!existeComponente) return null;

    if (existeComponente.typeInput === 'derivacion') {
      if (regla.valorOrigen !== 'value' && regla.valorOrigen.includes('invertir')) {
        return existeComponente.value.valores[regla.valorOrigen.replace('invertir', '')].reverse();
      }
      if (regla.valorOrigen !== 'value') {
        return existeComponente.value.valores[regla.valorOrigen];
      }
      return existeComponente.value?.valores;
    }

    if (['presupuesto', 'presupuestoIop', 'planillaEventual', 'eventual', 'donacion'].includes(existeComponente.typeInput)) {
      if (regla.valorOrigen === 'value') {
        return existeComponente.value?.valores;
      } else {
        if (regla.valorOrigen === 'operacion') {
          const n = existeComponente.value.valores.detalles.map(e => e.operacion);
          return [...new Map(n.map(item =>
            [item.id, item])).values()];
        }
        if (regla.valorOrigen === 'idSolicitud') return existeComponente.value?.valores?.id;
        return existeComponente.value?.valores[regla.valorOrigen];
      }
    }

    if (['pago'].includes(existeComponente.typeInput)) {
      if (regla.valorOrigen === 'value') {
        return existeComponente.value?.valores;
      } else {
        return existeComponente.value?.valores[regla.valorOrigen];
      }
    }

    if (existeComponente.typeInput === 'diaViaticos') {
      if (regla.valorOrigen === 'value') {
        return existeComponente.value?.valores;
      } else {
        return existeComponente.value?.valores[regla.valorOrigen];
      }
    }

    if (existeComponente.typeInput === 'pagoDetalle') {
      if (regla.valorOrigen === 'value') {
        return existeComponente.value?.valores;
      } else {
        if (regla.valorOrigen === 'item') {
          return existeComponente.value?.valores.consolidado;
        }
        return existeComponente.value?.valores[regla.valorOrigen];
      }
    }

    if (existeComponente.typeInput === 'pagoDivididos') {
      if (regla.valorOrigen === 'value') {
        return existeComponente.value?.valores;
      } else {
        return existeComponente.value?.valores[regla.valorOrigen];
      }
    }

    if (existeComponente.typeInput === 'funcionario') {
      switch (regla.valorOrigen) {
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

  function reemplazarComponenteDerivacion (campo, regla, valorNuevo = {}) {
    function cambiarValor (campo, tipoConfiguracion, subCampo, valorNuevo) {
      if (Array.isArray(valorNuevo)) {
        if (campo.configuracion[tipoConfiguracion].multiple) {
          campo.value.valores[subCampo] = valorNuevo;
        } else {
          campo.value.valores[subCampo] = valorNuevo[0];
        }
      } else {
        if (campo.configuracion[tipoConfiguracion].multiple) {
          campo.value.valores[subCampo] = [valorNuevo];
        } else {
          campo.value.valores[subCampo] = valorNuevo;
        }
      }
    }

    if (regla.valorDestino === 'value') {
      campo.value.valores = valorNuevo;
    }
    if (regla.valorDestino === 'de') {
      cambiarValor(campo, 'configDe', 'de', valorNuevo);
    }
    if (regla.valorDestino === 'via') {
      cambiarValor(campo, 'configVia', 'via', valorNuevo);
    }
    if (regla.valorDestino === 'para') {
      cambiarValor(campo, 'configPara', 'para', valorNuevo);
    }
    if (regla.valorDestino === 'referencia') {
      campo.value.valores[regla.valorDestino] = typeof valorNuevo !== 'string' ? JSON.stringify(valorNuevo) : valorNuevo;
    }
  }

  function setValorCampo (campos, regla, valorNuevo) {
    let indexComponent = null;
    if (regla.campoDestino) indexComponent = campos.findIndex(x => x.uid === regla.campoDestino);

    if (!indexComponent && indexComponent !== 0) return;

    valorNuevo = parsearValor(regla, valorNuevo, 'SET', campos[indexComponent].value.valores);

    if (campos[indexComponent].type === 'upload') {
      campos[indexComponent].value.valores = valorNuevo;
      return;
    }

    if (!campos[indexComponent]?.typeInput) return;

    if (campos[indexComponent].typeInput === 'derivacion') {
      reemplazarComponenteDerivacion(campos[indexComponent], regla, valorNuevo);
    }
    if (campos[indexComponent].typeInput === 'diaViaticos') {
      if (!campos[indexComponent].value.valores) {
        campos[indexComponent].value.valores = {};
      }
      if (regla.valorDestino === 'value') {
        campos[indexComponent].value.valores = valorNuevo;
      } else {
        campos[indexComponent].value.valores[regla.valorDestino] = valorNuevo;
      }
    }

    if (campos[indexComponent].typeInput === 'pagoDetalle') {
      if (!campos[indexComponent].value.valores) {
        campos[indexComponent].value.valores = {};
      }
      if (regla.valorDestino === 'value') {
        campos[indexComponent].value.valores = valorNuevo;
      } else {
        if (regla.valorDestino === 'item') {
          campos[indexComponent].value.valores.consolidado = valorNuevo;
        } else {
          campos[indexComponent].value.valores[regla.valorDestino] = valorNuevo;
        }
      }
    }

    if (campos[indexComponent].typeInput === 'pagoDivididos') {
      if (!campos[indexComponent].value.valores) {
        campos[indexComponent].value.valores = {};
      }
      if (regla.valorDestino === 'value') {
        campos[indexComponent].value.valores = valorNuevo;
      } else {
        if (regla.valorDestino === 'item') {
          campos[indexComponent].value.valores.consolidado = valorNuevo;
        } else {
          campos[indexComponent].value.valores[regla.valorDestino] = valorNuevo;
        }
      }
    }

    if (['presupuesto', 'planillaEventual', 'presupuestoIop', 'eventual', 'donacion'].includes(campos[indexComponent].typeInput)) {
      if (regla.valorDestino === 'value') {
        campos[indexComponent].value.valores = valorNuevo;
      } else {
        if (regla.valorDestino === 'idSolicitud') campos[indexComponent].value.valores.id = valorNuevo;
        else campos[indexComponent].value.valores[regla.valorDestino] = valorNuevo;
      }
    }

    if (['pago'].includes(campos[indexComponent].typeInput)) {
      if (regla.valorDestino === 'value') {
        campos[indexComponent].value.valores = valorNuevo;
      } else {
        campos[indexComponent].value.valores[regla.valorDestino] = valorNuevo;
      }
    }

    if (!['derivacion', 'diaViaticos', 'presupuesto', 'pago', 'eventual', 'planillaEventual', 'presupuestoIop', 'pagoDetalle', 'pagoDivididos', 'donacion'].includes(campos[indexComponent].typeInput)) {
      campos[indexComponent].value.valores  = valorNuevo;
    }
  }

  async function ejecutarInteroperabilidades (idDocumento, tipo, idUsuario, transaction) {
    try {
      let documento = await DocumentoRepository.findOne({ id: idDocumento }, transaction);
      console.log(`------------------------------ EJECUCIONES DE IOP DE TIPO:  ${tipo} CON GUARDADO DOCUMENTO: ${documento.editable}`);

      if (!documento) throw new Error('El documento no existe');

      const interoperabilidades = documento.plantilla?.configuracion_json.filter(item => item.type === 'interoperabilidad' && item.configuracion[tipo]);
      for (const interoperabilidad of interoperabilidades) {
        const interoperabilidadEjecutada = await EjecucionInteroperabilidadRepository.findOne({ idDocumento,  idComponente: interoperabilidad.uid });
        if ((interoperabilidad.configuracion.ejecutarUnico && !interoperabilidad.ejecutado && !interoperabilidadEjecutada) || !interoperabilidad.configuracion.ejecutarUnico) {
          interoperabilidad.configuracion.idComponente = interoperabilidad.uid;
          const respuesta = await ejecutarInteroperabilidad(interoperabilidad.configuracion, documento, true, idUsuario);
          for (const componente of respuesta) {
            if (componente.uid === interoperabilidad.uid) componente.ejecutado = true;
          }
          const plantillaFinal = documento.plantilla;
          plantillaFinal.configuracion_json = respuesta;

          const datosActualizacion = { id: documento.id, plantilla: plantillaFinal };

          if (idUsuario) datosActualizacion.userUpdated = idUsuario;

          if (documento.editable) documento = await DocumentoRepository.createOrUpdate(datosActualizacion, transaction);
        }
      }
      return documento;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async function interoperabilidadDerivacion (idDocumento, idUsuario, transaction) {
    try {
      const documento = await DocumentoRepository.findOne({ id: idDocumento }, transaction);
      if (!documento) {
        throw new Error('El documento no existe');
      }
      const configuracion = documento.plantilla?.configuracion_json;
      const interoperabilidades = configuracion.filter(item => JSON.stringify(item).includes('idServicio'));
      for (const interoperabilidad of interoperabilidades) {
        if (interoperabilidad?.configuracion?.ejecutarDerivar) {
          const interoperabilidadEjecutada = await EjecucionInteroperabilidadRepository.findOne({ idDocumento,  idComponente: interoperabilidad.uid });
          if ((interoperabilidad.configuracion.ejecutarUnico && !interoperabilidad.ejecutado && !interoperabilidadEjecutada) || !interoperabilidad.configuracion.ejecutarUnico) {
            interoperabilidad.configuracion.idComponente = interoperabilidad.uid;
            const respuesta = await ejecutarInteroperabilidad(interoperabilidad.configuracion, documento, true, idUsuario);
            documento.plantilla.configuracion_json = respuesta;
          }
        }
        if (interoperabilidad?.configuracion?.interoperabilidad?.solicitud?.idServicio) {
          const respuesta = await ejecutarInteroperabilidad(interoperabilidad.configuracion?.interoperabilidad?.solicitud, documento, true, idUsuario);
          documento.plantilla.configuracion_json = respuesta;
        }
        await DocumentoRepository.createOrUpdate({ id: documento.id, plantilla: documento.plantilla }, transaction);
      }
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  function setValueSubCampos (campos, regla, data) {
    const indexComponent = campos.findIndex(x => x.uid === regla.campoDestino);
    const arrayOrigen = regla.valorOrigen.indexOf('[]');
    if (arrayOrigen > 0) {
      const values = _.get(data, regla.valorOrigen.substring(0, arrayOrigen));
      let value = campos[indexComponent].value.valores;
      let textValue = `[${indexComponent}].value.valores`;
      if (regla.valorDestino !== 'value') {
        value = value[regla.valorDestino];
        textValue += `.${regla.valorDestino}`;
      }
      for (const index in values) {
        const valueAssign = _.get(data, regla.valorOrigen.replace('[]', `[${index}]`));
        const nuevaReglaSubcampo = regla.subCampos.replace('[]', `[${index}]`);
        if (Array.isArray(value)) {
          if (!regla.subCampos.includes('[]')) _.set(campos, `${textValue}[${index}].${nuevaReglaSubcampo}`, valueAssign);
          else _.set(campos, `${textValue}${nuevaReglaSubcampo}`, valueAssign);
        } else {
          _.set(campos, `${textValue}.${nuevaReglaSubcampo}`, valueAssign);
        }
      }
    } else {
      const valueAssign = _.get(data, regla.valorOrigen);
      _.set(campos, `[${indexComponent}].value.valores${regla.valorDestino !== 'value' ? `.${regla.valorDestino}.` : '.'}${regla.subCampos}`, valueAssign);
    }
    return campos;
  }

  function parsearValor (regla, valor, tipo = 'GET', valorAntiguo = null) {
    if (regla.usarLodash && regla.notacionLodash && tipo === 'SET') valor = _.set(valorAntiguo, regla.notacionLodash, valor);

    if (regla.usarLodash && regla.notacionLodash && tipo === 'GET') valor = _.get(valor, regla.notacionLodash);

    if (regla.transformacion === 'STRING') valor = JSON.stringify(valor);
    if (regla.transformacion === 'BOOLEAN') valor = Boolean(valor);
    if (regla.transformacion === 'FLOAT') valor = parseFloat(valor);
    if (regla.transformacion === 'INTEGER') valor = parseInt(valor);
    if (regla.transformacion === 'OBJECT') valor = JSON.parse(valor);
    if (regla.transformacion === 'ARRAY') valor = Array.from(valor);

    return valor;
  }

  async function ejecutarInteroperabilidad (configuracion, documento, mappeado = false, idUsuario = null) {
    const { envio, respuesta, idServicio } = configuracion;

    let configuracionJson = documento?.plantilla?.configuracion_json;
    console.log('==========_DESDE_INICIO_IOP==========');
    console.log(configuracion);
    async function ejecutarReglaIOPBody (regla, data, configuracionJson) {
      let valor = await getValorCampo(configuracionJson, regla, documento, idUsuario);
      valor = parsearValor(regla, valor, 'GET', null);

      if (!regla.subCampos) {
        if (regla.campoDestino.includes('[]')) {
          const index = regla.campoDestino.indexOf('[]');
          const resultados = _.get(data, regla.campoDestino.substring(0, index));
          for (const index in resultados) {
            const campo = regla.campoDestino.replace('[]', `[${index}]`);
            _.set(data, campo, valor);
          }
          return;
        }
        if (valor) _.set(data, regla.campoDestino, valor);
        return;
      }

      if (!Array.isArray(valor)) {
        if (regla.campoDestino.includes('[]')) {
          const index = regla.subCampos.indexOf('[]');
          const resultados = _.get(valor, regla.subCampos.substring(0, index));
          for (const index in resultados) {
            const campo = regla.campoDestino.replace('[]', `[${index}]`);
            const subCampos = regla.subCampos.replace('[]', `[${index}]`);
            const value = _.get(valor, subCampos);
            if (value) _.set(data, campo, value);
          }
          return;
        }
        const value = _.get(valor, regla.subCampos);
        if (value) _.set(data, regla.campoDestino, _.get(valor, regla.subCampos));
        return;
      }

      for (const index in valor) {
        const campo = regla.campoDestino.replace('[]', `[${index}]`);
        const value = _.get(valor[index], regla.subCampos);
        if (value) _.set(data, campo, value);
      }
    }

    async function ejecutarReglaIOPHeader (regla, headers, configuracionJson) {
      let valor = await getValorCampo(configuracionJson, regla, documento, idUsuario);

      valor = parsearValor(regla, valor, 'GET', null);

      if (!regla.subCampos) {
        _.set(headers, regla.campoDestino, valor);
        return;
      }
      if (!Array.isArray(valor)) {
        _.set(headers, regla.campoDestino, _.get(valor, regla.subCampos));
        return;
      }
      for (const index in valor) {
        const campo = regla.campoDestino.replace('[]', `[${index}]`);
        _.set(headers, campo, _.get(valor[index], regla.subCampos));
      }
    }

    async function mappeadoComplejo (mappeado, valorOrigen, valorDestino, data) {
      const arrayPositionOrigen = valorOrigen.indexOf('[]');
      const value = _.get(data, valorOrigen.substring(0, arrayPositionOrigen));
      for (const index in value) {
        const valorO = valorOrigen.replace('[]', `[${index}]`);
        const valorD = valorDestino.replace('[]', `[${index}]`);
        _.set(mappeado, valorD, _.get(data, valorO));
      }
      return mappeado;
    }

    try {
      const _existeServicio = await ServicioRepository.findOne({ id: envio?.idServicio || idServicio });

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
      console.log('==========_DESDE_STATUS_==========');
      console.log(initStatus);

      const init = {
        url     : `${_existeServicio.urlBase}${_existeServicio.urlServicio}`,
        method  : _existeServicio.metodo,
        headers : { Authorization: _existeServicio.token },
        data    : {}
      };

      if (envio?.body) {
        console.log('==========_DESDE_BODY_==========');
        console.log(envio?.body);
        for (const body of envio?.body) {
          await ejecutarReglaIOPBody(body, init.data, configuracionJson);
        }
      }
      if (envio?.headers) {
        console.log('==========_DESDE_HEADERS_==========');
        console.log(envio?.headers);
        for (const header of envio?.headers) {
          await ejecutarReglaIOPHeader(header, init.headers, configuracionJson);
        }
      }

      const queries = [];
      if (envio?.parametros) {
        console.log('==========_DESDE_PARAMETROS_==========');
        console.log(envio?.parametros);
        for (const parametro of envio?.parametros) {
          if (parametro.tipo === 'RUTA') {
            let valor = await getValorCampo(configuracionJson, parametro, documento, idUsuario);

            valor = parsearValor(parametro, valor, 'GET', null);

            if (parametro.subCampos) valor = _.get(valor, parametro.subCampos);
            init.url = init.url.replace(parametro.campoDestino, valor);
          }
          if (parametro.tipo === 'CONSULTA') {
            let valor = await getValorCampo(configuracionJson, parametro, documento, idUsuario);

            valor = parsearValor(parametro, valor, 'GET', null);

            if (valor) {
              if (!Array.isArray(valor)) {
                if (parametro.subCampos) valor = _.get(valor, parametro.subCampos);
                queries.push(`${parametro.campoDestino}=${valor}`);
              } else {
                for (let res of valor) {
                  if (parametro.subCampos) res = _.get(res, parametro.subCampos);
                  queries.push(`${parametro.campoDestino}=${res}`);
                }
              }
            }
          }
        }
      }

      if (queries.length > 0) {
        init.url = `${init.url}?${queries.join('&')}`;
      }

      try {
        console.log('ENVIO DE DATOS');
        console.log(init);
        const { data } = await axios(init);

        console.log('DESPUES DE LLAMAR A IOP');
        if (mappeado || mappeado === undefined || mappeado === null) {
          const formateado = {};
          for (const regla of respuesta) {
            if (!regla?.subCampos) {
              const nuevoValor = _.get(data, regla.valorOrigen);
              formateado[regla.valorOrigen] = nuevoValor;
              setValorCampo(configuracionJson, regla, nuevoValor);
            } else {
              configuracionJson = setValueSubCampos(configuracionJson, regla, data);
            }
          }

          await EjecucionInteroperabilidadRepository.createOrUpdate({
            idPaso              : null,
            idFlujo             : documento.idFlujo,
            idDocumento         : documento.id,
            idComponente        : configuracion.idComponente,
            envio               : init,
            respuesta           : data,
            respuestaFormateado : formateado,
            userCreated         : idUsuario || documento.userCreated
          });

          return configuracionJson;
        } else {
          let result = {};
          for (const regla of respuesta) {
            const arrayMappeadoDestino = regla.valorDestino.includes('[]');
            if (!arrayMappeadoDestino) _.set(result, regla.valorDestino, _.get(data, regla.valorOrigen));
            else result = await mappeadoComplejo(result, regla.valorOrigen, regla.valorDestino, data);
          }
          return result;
        }
      } catch (error) {
        console.log('==========_DESDE_ERROR_IOP==========');
        console.log(error);
        if (error?.response?.data) {
          const result = {};
          for (const regla of respuesta) {
            const arrayMappeadoDestino = regla.valorOrigen.includes('[]');
            if (!arrayMappeadoDestino) _.set(result, regla.valorDestino, _.get(error?.response?.data, regla.valorOrigen));
          }
          throw new ErrorApp(error?.response?.data?.mensaje, 400);
        }
        throw new ErrorApp('Error al consumir el servicio', 400);
      }
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  return {
    getValorCampo,
    ejecutarInteroperabilidades,
    ejecutarInteroperabilidad,
    interoperabilidadDerivacion,
    findOne,
    listar,
    createOrUpdate,
    createOrUpdateCompleto,
    deleteItem
  };
};
