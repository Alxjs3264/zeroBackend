'use strict';

const debug = require('debug')('app:service:formulario');
const { constants } = require('../../../common/config');
const { ErrorApp } = require('../../lib/error');
const axios = require('axios');
const { TIPOS_DERIVACIONES, TIPO_PASO, CAMPOS_NATIVOS, CLASIFICACION_FLUJO, CODIGO_PARAMETRO_CLASIFICACION_DEFECTO } = require('../../../common/config/constants');
const _ = require('lodash');
const { config } = require('../../../common');
const fs = require('fs');

module.exports = function solicitudPlantillaService (repositories, helpers) {
  const {
    FlujoDocumentalRepository,
    SolicitudPlantillaRepository,
    FormularioRepository,
    FlujoDerivacionRepository,
    PasoActualRepository,
    UsuarioRepository,
    DocumentoRepository,
    UsuarioCargoRepository,
    ServicioRepository,
    transaction,
    PasoRepository,
    ParametroRepository,
    EjecucionInteroperabilidadRepository
  } = repositories;

  const CorrelativoService = require('../gestion/CorrelativoService')(repositories, helpers, null);
  const DerivacionService = require('../gestion/DerivacionService')(repositories, helpers, null);
  const { verificarHojaRutaCite, registrarAprobacionCiudadania, calcularNumeroHR } = require('../system/UtilService')(repositories, helpers, null);
  const DocumentoService = require('../gestion/DocumentoService')(repositories, helpers, null);
  const ComponenteService = require('../bpm/ComponenteService')(repositories, helpers, null);
  const DocumentoCompartidoService = require('../gestion/DocumentoCompartidoService')(repositories, helpers, null);

  const { ConfiguracionCargoRepository } = repositories.planificacion;

  async function findAll (params) {
    try {
      const solicitudesPlantilla =  await FlujoDocumentalRepository.findAll(params);
      return solicitudesPlantilla;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function createOrUpdate (data) {
    debug('Crear o actualizar formulario');
    let transaccion;
    try {
      transaccion = await transaction.create();
      const _existeSolicitudPlantilla = await SolicitudPlantillaRepository.findOne({ id: data.idSolicitudPlantilla }, transaccion);

      if (!_existeSolicitudPlantilla) throw new Error('No existe la solicitud plantilla, buscada');

      if (_existeSolicitudPlantilla.pasos.length === 0) throw new Error(`El flujo "${_existeSolicitudPlantilla.nombre}" no tiene configurado correctamente sus pasos.`);

      const { count:  numeroInstancias } = await FlujoDocumentalRepository.findAll({ idSolicitudPlantilla: _existeSolicitudPlantilla.id, userCreated: data.userCreated, estado: 'PENDIENTE', tipo: 'SIPFA' }, transaccion);

      if (numeroInstancias >= _existeSolicitudPlantilla.instancias) {
        throw new Error(`No puede crear mas solicitudes de ${_existeSolicitudPlantilla.nombre} hasta que se finalice alguna de sus solicitudes que estan pendientes.`);
      }

      const pasoInicio = _existeSolicitudPlantilla.pasos.find(x => x.pasosAnteriores.length === 0);

      let idPasoSiguiente = pasoInicio.pasosSiguientes[0].idPasoSiguiente;

      if (data.idPasoSeleccionado) {
        idPasoSiguiente = pasoInicio.pasosSiguientes.find(x => x.idPasoSiguiente === data.idPasoSeleccionado).idPasoSiguiente;
      }

      const formularioInicial = _existeSolicitudPlantilla.pasos.find(x => x.id === idPasoSiguiente);

      const { codigoFlujo, codigoUnicoFlujo } = await CorrelativoService.generarCodigos({ idUsuario: data.userCreated, flujo: true, documento: false, userCreated: data.userCreated }, transaccion);

      const usuario = await UsuarioRepository.findOne({ id: data.userCreated }, transaccion);

      let clasificacion = data.clasificacion || 'ABIERTO';

      if (!data.clasificacion) {
        const existeParametroClasificacion = await ParametroRepository.findOne({ codigo: CODIGO_PARAMETRO_CLASIFICACION_DEFECTO, estado: 'ACTIVO' });
        if (existeParametroClasificacion) clasificacion = existeParametroClasificacion.descripcion;
      }

      const flujoDocumentalCreado = await FlujoDocumentalRepository.createOrUpdate({
        tipo                   : 'SIPFA',
        clasificacion          : clasificacion || 'ABIERTO',
        historialClasificacion : [{
          motivo        : 'Por creacion de nuevo tramite',
          idUsuario     : data.userCreated,
          usuario       : `${usuario.nombres} ${usuario.primerApellido} ${usuario.segundoApellido}`,
          clasificacion : data.clasificacion || CLASIFICACION_FLUJO.CONFIDENCIAL || 'ABIERTO',
          fecha         : new Date()
        }],
        idFlujoPadre         : data.idFlujoOriginal,
        codigoFlujo,
        numeroHr             : codigoUnicoFlujo,
        idSolicitudPlantilla : _existeSolicitudPlantilla.id,
        userCreated          : data.userCreated
      }, transaccion);

      await PasoActualRepository.createOrUpdate({ idFlujoDocumental: flujoDocumentalCreado.id, userCreated: data.userCreated, idPaso: formularioInicial.id }, transaccion);

      const _existePlantilla = await FormularioRepository.findOne({ id: formularioInicial.idFormulario  }, transaccion);

      if (!_existePlantilla) throw new Error('La plantilla para este paso, no existe.');

      for (const element of _existePlantilla.configuracion_json) {
        element.value = { uid: element.uid, type: element.type, name: element.name, valores: element.value || element.defaultValue || '' };
      }

      if (data.valoresIniciales) {
        for (const valor of data.valoresIniciales) {
          const indexComponente = _existePlantilla.configuracion_json.findIndex(x => x.name === valor.name);

          if (!indexComponente && indexComponente !== 0) throw new Error(`No se encuentra el componente ${valor.name} para poner su valor,`);

          if (valor.hasOwnProperty('readonly')) _existePlantilla.configuracion_json[indexComponente].readonly = valor.readonly;

          if (valor.hasOwnProperty('visible')) _existePlantilla.configuracion_json[indexComponente].visible = valor.visible;

          if (indexComponente || indexComponente === 0) _existePlantilla.configuracion_json[indexComponente].value.valores = valor.value;
        }
      }

      const documento = await DocumentoRepository.createOrUpdate({
        idFlujo        : flujoDocumentalCreado.id,
        asunto         : data.asunto ||   _existePlantilla.nombre,
        hojaRuta       : codigoFlujo,
        estado         : data.valoresIniciales ? 'DERIVADO' : 'BORRADOR',
        plantillaValor : [],
        plantilla      : _existePlantilla,
        userCreated    : data.userCreated
      }, transaccion);

      if (Array.isArray(data.usuariosComparir)) {
        await DocumentoCompartidoService.createOrUpdate({
          idDocumento      : documento.id,
          userCreated      : data.userCreated,
          usuariosComparir : data.usuariosComparir
        }, transaccion);
      }

      const datosNuevaDerivacion = {
        idFlujo               : flujoDocumentalCreado.id,
        descripcion           : _existePlantilla.nombre,
        idDocumento           : documento.id,
        idPaso                : formularioInicial.id,
        idUsuarioDestinatario : data.userCreated,
        nombreDestinatario    : `${usuario.nombres} ${usuario.primerApellido} ${usuario.segundoApellido}`,
        cargoDestinatario     : usuario.cargo,
        idCargoDestinatario   : usuario.idCargo,
        userCreated           : data.userCreated,
        etapa                 : 'INICIO',
        fechaRecepcion        : new Date(),
        estadoActual          : 'ACTIVO'
      };

      if (data.valoresIniciales) {
        datosNuevaDerivacion.descripcion = data.asunto || _existePlantilla.nombre;
        datosNuevaDerivacion.estado = 'RECIBIDO';
      }

      const flujoDerivacion = await FlujoDerivacionRepository.createOrUpdate(datosNuevaDerivacion, transaccion);

      await transaction.commit(transaccion);

      return flujoDerivacion.id;
    } catch (error) {
      debug('ERRORRRRR!!! ', error);
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function findOne (params) {
    debug('Crear o actualizar formulario');
    let solicitudPlantilla;
    try {
      solicitudPlantilla = await FlujoDocumentalRepository.findOne(params);
      return solicitudPlantilla;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function deleteItem (id) {
    debug('Eliminando formulario', id);
    try {
      const resultado = await FlujoDocumentalRepository.deleteItem(id);
      return resultado;
    } catch (err) {
      debug(err);
      throw new ErrorApp(err.message, 400);
    }
  }

  function getValorCampo (campos, regla) {
    if (regla.estatico) {
      try {
        return JSON.parse(regla.campo);
      } catch {
        return regla.campo;
      }
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

    if (['presupuesto', 'presupuestoIop', 'eventual'].includes(existeComponente.typeInput)) {
      if (regla.campo.subCampo !== 'value') {
        if (existeComponente.value.valores.hasOwnProperty(regla.campo.subCampo)) {
          return existeComponente.value?.valores?.[regla.campo.subCampo];
        }
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

    if (regla.campo.subCampo === 'value') {
      campo.value.valores = valorNuevo;
    }
    if (regla.campo.subCampo === 'de') {
      cambiarValor(campo, 'configDe', 'de', valorNuevo);
    }
    if (regla.campo.subCampo === 'via') {
      cambiarValor(campo, 'configVia', 'via', valorNuevo);
    }
    if (regla.campo.subCampo === 'para') {
      cambiarValor(campo, 'configPara', 'para', valorNuevo);
    }
    if (regla.campo.subCampo === 'referencia') {
      campo.value.valores[regla.campo.subCampo] = typeof valorNuevo !== 'string' ? JSON.stringify(valorNuevo) : valorNuevo;
    }
  }

  function setValorCampo (campos, regla, valorNuevo) {
    if (!regla.campo?.id) return campos;

    console.log('==========_DESDE_CAMPO_DESTINO_==========');
    console.log(regla, valorNuevo);

    if (regla.transformacion === 'STRING') valorNuevo = JSON.stringify(valorNuevo);
    if (regla.transformacion === 'BOOLEAN') valorNuevo = Boolean(valorNuevo);
    if (regla.transformacion === 'FLOAT') valorNuevo = parseFloat(valorNuevo);
    if (regla.transformacion === 'INTEGER') valorNuevo = parseInt(valorNuevo);
    if (regla.transformacion === 'OBJECT') valorNuevo = JSON.parse(valorNuevo);
    if (regla.transformacion === 'ARRAY') valorNuevo = Array.from(valorNuevo);

    const indexComponent = campos.findIndex(x => x.uid === regla.campo.id);

    if (regla.usarLodash && regla.notacionLodash) {
      _.set(campos[indexComponent].value.valores, regla.notacionLodash, valorNuevo);
      return campos;
    };

    if (campos[indexComponent].typeInput === 'derivacion') {
      reemplazarComponenteDerivacion(campos[indexComponent], regla, valorNuevo);
    }

    if (campos[indexComponent].typeInput === 'diaViaticos') {
      if (!campos[indexComponent].value.valores) {
        campos[indexComponent].value.valores = {};
      };

      if (regla.campo.subCampo === 'value') {
        campos[indexComponent].value.valores = valorNuevo;
      } else {
        campos[indexComponent].value.valores[regla.campo.subCampo] = valorNuevo;
      }
    }

    if (campos[indexComponent].typeInput === 'pagoDetalle') {
      if (!campos[indexComponent].value.valores) {
        campos[indexComponent].value.valores = {};
      }
      if (regla.campo.subCampo === 'value') {
        campos[indexComponent].value.valores = valorNuevo;
      } else {
        if (regla.campo.subCampo === 'item') {
          campos[indexComponent].value.valores.consolidado = valorNuevo;
        } else {
          campos[indexComponent].value.valores[regla.campo.subCampo] = valorNuevo;
        }
      }
    }

    if (campos[indexComponent].typeInput === 'pagoDivididos') {
      if (!campos[indexComponent].value.valores) {
        campos[indexComponent].value.valores = {};
      }
      if (regla.campo.subCampo === 'value') {
        campos[indexComponent].value.valores = valorNuevo;
      } else {
        if (regla.campo.subCampo === 'item') {
          campos[indexComponent].value.valores.consolidado = valorNuevo;
        } else {
          campos[indexComponent].value.valores[regla.campo.subCampo] = valorNuevo;
        }
      }
    }

    if (['presupuesto', 'eventual', 'presupuestoIop'].includes(campos[indexComponent].typeInput)) {
      if (regla.campo.subCampo === 'value') {
        campos[indexComponent].value.valores = valorNuevo;
      } else {
        campos[indexComponent].value.valores[regla.campo.subCampo] = valorNuevo;
      }
    }

    if (!['derivacion', 'diaViaticos', 'presupuesto', 'eventual', 'presupuestoIop', 'pagoDetalle', 'pagoDivididos'].includes(campos[indexComponent].typeInput)) {
      campos[indexComponent].value.valores  = valorNuevo;
    }

    return campos;
    // TODO: Adicionar tipos de componentes especificos.
    /* if (campos[indexComponent].typeInput !== 'derivacion' && campos[indexComponent].typeInput !== 'diaViaticos') {
      campos[indexComponent].value.valores  = valorNuevo;
    } */
  }

  async function getDocumentoActual ({ idFlujo, idFormulario, configuracion, idUsuario }, t) {
    let transaccion;
    try {
      transaccion = t || await transaction.create();
      let documento = await DocumentoRepository.findOne({ idFlujo, plantilla: { id: idFormulario } }, transaccion);

      if (!documento) {
        const _existePlantilla = await FormularioRepository.findOne({ id: idFormulario }, transaccion);
        if (!_existePlantilla) throw new Error('La plantilla para este paso, no existe.');
        for (const element of _existePlantilla.configuracion_json) {
          element.value = { type: element.type, name: element.name, valores: element.value || element.defaultValue || '' };
        }
        documento = await DocumentoRepository.createOrUpdate({ idFlujo, plantilla: { id: idFormulario }, userCreated: idUsuario }, transaccion);
      }

      if (configuracion && documento?.plantillaValor?.length === 0) {
        const documentoDestino = await DocumentoRepository.findOne({ id: documento.id }, transaccion);
        for (const asignacion of configuracion) {
          const { campoOrigen, campoDestino } = asignacion;
          const valorOrigen = await getValue(idFlujo, campoOrigen, {}, transaccion);

          documentoDestino.plantilla.configuracion_json = setValorCampo(documentoDestino.plantilla.configuracion_json, campoDestino, valorOrigen);
        }
        documento = await DocumentoRepository.createOrUpdate({ id: documentoDestino.id, plantilla: documentoDestino.plantilla, userUpdated: idUsuario }, transaccion);
      }
      if (!t) await transaction.commit(transaccion);
      return documento;
    } catch (error) {
      if (!t) await transaction.rollback(transaccion);
      throw new Error(error.message);
    }
  }

  async function getConfiguracionPaso (paso, idUsuario, idFlujoDocumental) {
    if (!paso.multiplesFormularios) {
      paso.listaFormularios = [paso.idFormulario];
    }
    if (!paso) return null;

    let idCargo = null;
    if (paso.idTipoCargo === constants.TIPO_CARGO.TODOS) {
      // TODO: Completar en caso de cargo todos?
      idCargo = null;
    }

    if (paso.idTipoCargo === constants.TIPO_CARGO.CAMPO_FORMULARIO && paso.campo) {
      let numeroDocumento = await getValue(idFlujoDocumental, paso.campo, idUsuario,  null);

      if (!paso.campo.notacionLodash && paso.campo.subCampo) numeroDocumento = numeroDocumento[paso.campo.subCampo];

      if (paso.campo.notacionLodash && paso.campo.subCampo) numeroDocumento = _.get(numeroDocumento, paso.campo.subCampo);

      console.log(`===============>>>>>>>> LODASH: ${paso.campo.notacionLodash}, SUBCAMPO: ${paso.campo.subCampo}, NUMERO DE DOCUMENTO: ${numeroDocumento}`);

      if (typeof numeroDocumento !== 'object' && numeroDocumento) {
        const _existeUsuario = await UsuarioRepository.findOne({ numeroDocumento });
        idCargo = _existeUsuario?.idCargo;
      }
    }

    if (paso.idTipoCargo === constants.TIPO_CARGO.DEPENDENCIA_FUNCIONAL) {
      const { cargoUsuario } = await UsuarioRepository.findOne({ id: idUsuario });
      if (paso.dependenciaFuncional === constants.DEPENDENCIA.LINEAL) {
        idCargo = cargoUsuario.configuracionCargos[0].idDepenenciaLinea;
      }
      if (paso.dependenciaFuncional === constants.DEPENDENCIA.FUNCIONAL) {
        idCargo = cargoUsuario.configuracionCargos[0].idDependenciaFuncional;
      }
      if (paso.dependenciaFuncional === constants.DEPENDENCIA.FORMULARIO) {
        idCargo = cargoUsuario.configuracionCargos[0].idDependenciaFormulario;
      }
      if (paso.dependenciaFuncional === constants.DEPENDENCIA.POAI) {
        idCargo = cargoUsuario.configuracionCargos[0].idDependenciaPoai;
      }
      if (paso.dependenciaFuncional === constants.DEPENDENCIA.APRUEBA_VIAJE) {
        idCargo = cargoUsuario.configuracionCargos[0].idApruebaViaje;
      }
      if (paso.dependenciaFuncional === constants.DEPENDENCIA.ELABORA_MEMORANDUM_VIAJE) {
        idCargo = cargoUsuario.configuracionCargos[0].idElaboraMemorandumViaje;
      }
    }

    if (paso.idTipoCargo === constants.TIPO_CARGO.SOLICITANTE) {
      const solicitante = await FlujoDerivacionRepository.findSolicitante(idFlujoDocumental);
      const { cargoUsuario } = await UsuarioRepository.findOne({ id: solicitante.idUsuarioDestinatario });
      idCargo = cargoUsuario.id;
    }

    if (paso.idTipoCargo === constants.TIPO_CARGO.ESPECIFICO) {
      idCargo = paso.configuracionCargo;
    }

    if (paso.idTipoCargo === constants.TIPO_CARGO.FORMULARIO) {
      // TODO: Completar en caso de cargo por formulario?
      console.log(paso);
      idCargo = null;
    }

    if (paso.idTipoCargo === constants.TIPO_CARGO.DEPENDIENTES) {
      // TODO: Completar en caso de cargo por formulario?
      const { cargoUsuario } = await UsuarioRepository.findOne({ id: idUsuario });
      const { rows } = await ConfiguracionCargoRepository.findAll({ idDepenenciaLinea: cargoUsuario.id });

      idCargo = [cargoUsuario.id, ...rows.map(e => e.idCargo)];
    }
    let usuarios = [];

    if (idCargo || paso.idTipoCargo === constants.TIPO_CARGO.TODOS) ({ rows: usuarios } = await UsuarioCargoRepository.findAll({ idCargo, estado: 'ACTIVO' }));

    if (paso.idEntidad) ({ rows: usuarios } = await UsuarioCargoRepository.findAll({ idEntidad: paso.idEntidad, estado: 'ACTIVO' }));

    return {
      id                    : paso.id,
      nombreFormulario      : paso.nombrePaso,
      descripcionFormulario : paso.nombrePaso,
      mostrarEntidad        : paso.mostrarEntidad,
      idEntidad             : paso.idEntidad,
      idFormulario          : paso.idFormulario,
      listaFormularios      : paso.listaFormularios,
      multiplesFormularios  : paso.multiplesFormularios,
      tipo                  : paso.tipo,
      proveidoDefecto       : paso.proveidoDefecto,
      tipoFinalizacion      : paso.tipoFinalizacion,
      idAccion              : TIPOS_DERIVACIONES[paso.tipoFinalizacion],
      recuperarDocumento    : paso.recuperarDocumento,
      usuariosDerivacion    : usuarios
    };
  }

  function parsearDerivacion (configuracionJson) {
    for (const componente of configuracionJson) {
      if (componente.type === 'derivacion') {
        if (Array.isArray(componente.value?.valores?.de)) {
          for (const valueDe of componente.value?.valores?.de) {
            if (!valueDe.hasOwnProperty('visiblePdf')) {
              valueDe.visiblePdf = true;
            }
          }
        } else if (componente.value?.valores?.de) {
          if (!componente.value?.valores?.de.hasOwnProperty('visiblePdf')) {
            componente.value.valores.de.visiblePdf = true;
          }
        }

        if (Array.isArray(componente.value?.valores?.via)) {
          for (const valueVia of componente.value?.valores?.via) {
            if (!valueVia.hasOwnProperty('visiblePdf')) {
              valueVia.visiblePdf = true;
            }
          }
        } else if (componente.value?.valores?.via) {
          if (!componente.value?.valores?.via.hasOwnProperty('visiblePdf')) {
            // componente.value.valores.via.visiblePdf = true;
          }
        }

        if (Array.isArray(componente.value?.valores?.para)) {
          for (const valuePara of componente.value?.valores?.para) {
            if (!valuePara.hasOwnProperty('visiblePdf')) {
              valuePara.visiblePdf = true;
            }
          }
        } else if (componente.value?.valores?.para) {
          if (!componente.value?.valores?.para.hasOwnProperty('visiblePdf')) {
            componente.value.valores.para.visiblePdf = true;
          }
        }
      }
    }
  }

  async function findPasoActual (idFlujoDocumental, idUsuario) {
    debug('Crear o actualizar formulario');
    let transaccion;
    try {
      const flujoDocumental = await FlujoDocumentalRepository.findOne({ id: idFlujoDocumental }, { estadoActual: 'ACTIVO'  });

      if (!flujoDocumental) throw new Error('No existe la solicitud solicitada.');

      const respuesta = {
        tienePasosObservacion : false,
        tienePasosSiguientes  : false,
        esEditable            : false,
        esCancelable          : false,
        documento             : {},
        pasosActuales         : []
      };

      for (const pasoActualIterate of flujoDocumental.pasosActuales) {
        const pasoActual = await PasoActualRepository.findOne({ id: pasoActualIterate.id }, transaccion);

        const { idFormulario, pasosSiguientes, pasosObservacion, configuracion } = pasoActual.pasoActual;

        let formularioId = idFormulario;

        if (flujoDocumental.flujoDerivaciones[0].tipo === 'PROVEIDO') formularioId = flujoDocumental.flujoDerivaciones[0].documento.plantilla.id;

        const existeCancelacion = pasoActual.pasoActual.pasosSiguientes.find(paso => paso.pasoSiguiente.tipo === 'fallo');
        respuesta.esCancelable = !!existeCancelacion;

        const documento = await getDocumentoActual({ idFlujo: flujoDocumental.id, idFormulario: formularioId, configuracion, idUsuario }, transaccion);

        respuesta.tienePasosObservacion = pasosObservacion.length > 0;
        respuesta.tienePasosSiguientes = pasosSiguientes.length > 0;
        respuesta.esEditable = documento.editable;

        documento.flujoDerivaciones = flujoDocumental.flujoDerivaciones;
        documento.flujoDocumental = flujoDocumental;
        respuesta.documento = documento;

        parsearDerivacion(documento.plantilla.configuracion_json);

        const configuracionPasoActual = await getConfiguracionPaso(pasoActual.pasoActual, idUsuario, flujoDocumental.id);

        respuesta.pasosActuales.push(configuracionPasoActual);
      }

      await transaction.commit(transaccion);

      return respuesta;
    } catch (error) {
      await transaction.rollback(transaccion);
      throw new Error(error.message);
    }
  }

  function evaluarRegla (valorOrigen, operador, valorDestino) {
    console.log('=====_EVALUACION_VALORES_DECISION_           ', valorOrigen, operador, valorDestino);
    if (operador === '===') return valorOrigen === valorDestino;
    if (operador === '!=') return valorOrigen !== valorDestino;
    if (operador === '>') return valorOrigen > valorDestino;
    if (operador === '>=') return valorOrigen >= valorDestino;
    if (operador === '<') return valorOrigen < valorDestino;
    if (operador === '<=') return valorOrigen <= valorDestino;
    if (operador === 'contains') return JSON.stringify(valorOrigen)?.includes(valorDestino);
    if (operador === 'no-contains') return !JSON.stringify(valorOrigen)?.includes(valorDestino);
  }

  async function evaluarConfiguracionDecision (idFlujo, configuraciones) {
    const respuestaFinalConfiguracion = [];
    for (const configuracion of configuraciones) {
      let respuestaConfiguracion = false;
      const valoresReglas = [];
      for (const regla of configuracion.reglas) {
        const { campoOrigen, campoDestino } = regla;
        let valorOrigen = campoOrigen.estatico ? campoOrigen.campo : null;
        let valorDestino = campoDestino.estatico ? campoDestino.campo : null;

        if (!campoOrigen.estatico) valorOrigen = await getValue(idFlujo, campoOrigen);

        if (!campoDestino.estatico) valorDestino = await getValue(idFlujo, campoDestino);

        const resultadoRegla = evaluarRegla(valorOrigen, regla.operador, valorDestino);
        valoresReglas.push(resultadoRegla);
        console.log('RESPUESTA REGLA => ', resultadoRegla);
      }

      if (configuracion.operador === 'and') respuestaConfiguracion = valoresReglas.every(x => x === true);
      if (configuracion.operador === 'or') respuestaConfiguracion = valoresReglas.some(x => x === true);

      respuestaFinalConfiguracion.push(respuestaConfiguracion);
    }

    return respuestaFinalConfiguracion.every(x => x === true);
  }

  async function getValue (idFlujo, campoOrigen, usuarioActual, transaccion) {
    let documento = { plantilla: { configuracion_json: [] } };
    let valor = null;

    if (campoOrigen.estatico) valor = campoOrigen.campo;
    console.log('==========_DESDE_GET_VALUE_==========');
    console.log(campoOrigen);

    if (campoOrigen.campo?.type === 'NATIVO') {
      const respuestaFlujo = idFlujo ? await FlujoDocumentalRepository.findOne({ id: idFlujo }, transaccion) : {};
      const respuestaDocumento = await DocumentoRepository.findOne({ idFlujo, plantilla: { id: campoOrigen.campo?.idPlantilla } }, transaccion);
      if (campoOrigen.campo?.name.toLowerCase() === CAMPOS_NATIVOS.ID_DOCUMENTO.toLowerCase()) valor = respuestaDocumento.id;
      if (campoOrigen.campo?.name.toLowerCase() === CAMPOS_NATIVOS.ID_FLUJO.toLowerCase()) valor = idFlujo;
      if (campoOrigen.campo?.name.toLowerCase() === CAMPOS_NATIVOS.CITE.toLowerCase()) valor = respuestaDocumento.cite;
      if (campoOrigen.campo?.name.toLowerCase() === CAMPOS_NATIVOS.HOJA_RUTA.toLowerCase()) valor = respuestaDocumento.hojaRuta;
      if (campoOrigen.campo?.name.toLowerCase() === CAMPOS_NATIVOS.FECHA_DOCUMENTO.toLowerCase()) {
        const [dia, mes, anio] = respuestaDocumento.fechaDocumento.split('-');
        valor = `${anio}-${mes}-${dia}`;
      }
      if (campoOrigen.campo?.name.toLowerCase() === CAMPOS_NATIVOS.CLASIFICACION.toLowerCase()) valor = respuestaFlujo.clasificacion;
      if (campoOrigen.campo?.name.toLowerCase() === CAMPOS_NATIVOS.FECHA_CREACION.toLowerCase()) valor = respuestaDocumento.createdAt;
      if (campoOrigen.campo?.name.toLowerCase() === CAMPOS_NATIVOS.ESTADO_DOCUMENTO.toLowerCase()) valor = respuestaDocumento.estado;
      if (campoOrigen.campo?.name.toLowerCase() === CAMPOS_NATIVOS.ESTADO_FLUJO.toLowerCase()) valor = respuestaFlujo.estado;
      if (campoOrigen.campo?.name.toLowerCase() === CAMPOS_NATIVOS.USUARIO_ACTUAL.toLowerCase()) valor = usuarioActual;
    }

    if (campoOrigen.campo?.type === 'FORMULARIO') {
      const respuestaDocumento = await DocumentoRepository.findOne({ idFlujo, plantilla: { id: campoOrigen.campo?.idPlantilla } }, transaccion);
      if (respuestaDocumento) documento = respuestaDocumento;
      valor = getValorCampo(documento.plantilla.configuracion_json, campoOrigen, documento);
    }

    if (campoOrigen.campo?.type === 'INTEROPERABILIDAD') {
      const respuestaIop = await EjecucionInteroperabilidadRepository.findOne({ idFlujo, idPaso: campoOrigen.campo?.idPlantilla }, transaccion);
      if (respuestaIop) valor = respuestaIop.respuestaFormateado[campoOrigen.campo?.name];
    }

    if (campoOrigen.usarLodash && campoOrigen.notacionLodash) valor = _.get(valor, campoOrigen.notacionLodash);

    if (campoOrigen.transformacion === 'STRING') valor = JSON.stringify(valor);
    if (campoOrigen.transformacion === 'BOOLEAN') valor = Boolean(valor);
    if (campoOrigen.transformacion === 'FLOAT') valor = parseFloat(valor);
    if (campoOrigen.transformacion === 'INTEGER') valor = parseInt(valor);
    if (campoOrigen.transformacion === 'OBJECT') valor = JSON.parse(valor);
    if (campoOrigen.transformacion === 'ARRAY') valor = Array.from(valor);

    console.log('DESDE VALOR: ', campoOrigen.estatico, campoOrigen.campo?.type, campoOrigen.campo?.name, ' => ', valor, 'LODASH: ', campoOrigen.usarLodash, campoOrigen.notacionLodash);
    return valor;
  }

  async function evaluarConfiguracionInteroperabilidad (idFlujo, envio, respuesta, usuarioActual, transaccion) {
    async function ejecutarReglaIOPBody (regla, data, transaccion) {
      data[regla.campoDestino.campo] = await getValue(idFlujo, regla.campoOrigen, usuarioActual, transaccion);
    }

    async function ejecutarReglaIOPHeader (regla, headers, transaccion) {
      headers[regla.campoDestino.campo] = await getValue(idFlujo, regla.campoOrigen, usuarioActual, transaccion);
    }

    const _existeServicio = await ServicioRepository.findOne({ id: envio.idServicio }, transaccion);

    if (!_existeServicio) throw new Error('No existe el servicio solicitado.');

    const initStatus = {
      method  : 'GET',
      url     : `${_existeServicio.urlBase}${_existeServicio.urlStatus}`,
      headers : { Authorization: _existeServicio.token }
    };

    try {
      await axios(initStatus);
    } catch (error) {
      throw new Error(`El servicio de ${_existeServicio.nombre} no se encuentra disponible`);
    }

    const init = {
      url     : `${_existeServicio.urlBase}${_existeServicio.urlServicio}`,
      method  : _existeServicio.metodo,
      headers : { Authorization: _existeServicio.token },
      data    : {}
    };

    for (const body of envio.body) {
      await ejecutarReglaIOPBody(body, init.data, transaccion);
    }

    for (const header of envio.headers) {
      await ejecutarReglaIOPHeader(header, init.headers, transaccion);
    }

    const queries = [];
    for (const parametro of envio.parametros) {
      if (parametro.campoDestino.tipo === 'RUTA') {
        const valor = await getValue(idFlujo, parametro.campoOrigen, usuarioActual, transaccion);
        init.url = init.url.replace(parametro.campoDestino.campo, valor);
      }
      if (parametro.campoDestino.tipo === 'CONSULTA') {
        const valor = await getValue(idFlujo, parametro.campoOrigen, usuarioActual, transaccion);
        queries.push(`${parametro.campoDestino.campo}=${valor}`);
      }
    }

    if (queries.length > 0) init.url = `${init.url}?${queries.join('&')}`;

    try {
      console.log('==========_DATOS_ENVIO_IOP_==========');
      console.log(init);
      const { data } = await axios(init);
      const respuestaFormateado = {};

      for (const resp of respuesta) {
        respuestaFormateado[resp.path] = _.get(data, resp.path);
      }

      return { envio: init, respuesta: data, respuestaFormateado };
    } catch (error) {
      console.log('DESDE ERROR IOP: ', error);
      throw new Error(`IOP: ${error?.response?.data?.mensaje}` || 'Error al consumir el servicio');
    }
  }

  async function pasosSiguientes ({ idFlujoDocumental, idUsuario, idPaso, idPasoOrigen, nodos, pasosSiguientesFinal }) {
    try {
      const paso = await PasoRepository.findOne({ id: idPaso });

      if (paso.tipo === 'decision') {
        const resultadoDecision = await evaluarConfiguracionDecision(idFlujoDocumental, paso.configuracion);

        const nodo = nodos[paso.id];

        let caminoElegido = nodo.outputs.output_3.connections.map(x => x.node);
        if (resultadoDecision) {
          caminoElegido = nodo.outputs.output_1.connections.map(x => x.node);
        }
        paso.pasosSiguientes = paso.pasosSiguientes.filter(x => caminoElegido.includes(x.pasoSiguiente.id));
      }
      for (const pasoSiguiente of paso.pasosSiguientes) {
        if (['formulario', 'fin'].includes(pasoSiguiente.pasoSiguiente.tipo)) {
          // console.log('\n\nPaso Siguiente: ', pasoSiguiente);
          // if (!pasoSiguiente.pasoSiguiente.multiplesFormularios) {
          //   pasoSiguiente.pasoSiguiente.listaFormularios = [pasoSiguiente.pasoSiguiente.idFormulario];
          // }
          const configuracionPasoSiguiente = await getConfiguracionPaso(pasoSiguiente.pasoSiguiente, idUsuario, idFlujoDocumental);
          if (configuracionPasoSiguiente.tipoFinalizacion === constants.TIPO_FINALIZACION.PROVEIDO) {
            const paso = await PasoRepository.findOne({ id: idPasoOrigen });
            configuracionPasoSiguiente.idFormulario = paso?.idFormulario;
          } else {
            if (pasoSiguiente.pasoSiguiente.tipo !== 'fin') {
              const usuarios = await derivacionConfiguradaReplace(configuracionPasoSiguiente.id, idFlujoDocumental);
              if (Array.isArray(usuarios) && usuarios.length > 0) {
                configuracionPasoSiguiente.usuariosDerivacion = usuarios;
              }
            }
          }
          pasosSiguientesFinal.push(configuracionPasoSiguiente);
        }

        if (pasoSiguiente.pasoSiguiente.tipo === 'interoperabilidad') {
          const pasoIop = await PasoRepository.findOne({ id: pasoSiguiente.pasoSiguiente.id });

          if (!pasoIop.pasosSiguientes[0]) throw new Error('La interoperabilidad no tiene pasos siguientes configurados.');

          if (pasoIop.pasosSiguientes.length === 1 && pasoIop.pasosSiguientes[0].pasoSiguiente?.tipo === 'formulario') {
            const pasoFormulario = pasoIop.pasosSiguientes[0].pasoSiguiente;
            pasoSiguiente.pasoSiguiente.tipoFinalizacion = pasoFormulario.tipoFinalizacion;
            pasoSiguiente.pasoSiguiente.idFormulario = pasoFormulario.idFormulario;
            pasoSiguiente.pasoSiguiente.idTipoCargo = pasoFormulario.idTipoCargo;
            pasoSiguiente.pasoSiguiente.dependenciaFuncional = pasoFormulario.dependenciaFuncional;
            pasoSiguiente.pasoSiguiente.configuracionCargo = pasoFormulario.configuracionCargo;
          }

          const configuracionPasoSiguiente =  await getConfiguracionPaso(pasoSiguiente.pasoSiguiente, idUsuario, idFlujoDocumental);
          pasosSiguientesFinal.push(configuracionPasoSiguiente);
        }

        if (pasoSiguiente.pasoSiguiente.tipo === 'decision') {
          const resultadoDecision = await evaluarConfiguracionDecision(idFlujoDocumental, pasoSiguiente.pasoSiguiente.configuracion);

          const nodo = nodos[pasoSiguiente.idPasoSiguiente];

          let caminoElegido = nodo.outputs.output_3.connections.map(x => x.node);
          if (resultadoDecision) {
            caminoElegido = nodo.outputs.output_1.connections.map(x => x.node);
          }

          for (const camino of caminoElegido) {
            const pasoElegido = await PasoRepository.findOne({ id: camino });
            if (pasoElegido.tipo === TIPO_PASO.DECISION)  await pasosSiguientes({ idFlujoDocumental, idUsuario, idPaso: pasoElegido.id, idPasoOrigen, nodos, pasosSiguientesFinal });

            if ([TIPO_PASO.FORMULARIO, TIPO_PASO.FIN].includes(pasoElegido.tipo)) {
              const configuracionPasoSiguiente =  await getConfiguracionPaso(pasoElegido, idUsuario, idFlujoDocumental);
              if (pasoSiguiente.pasoSiguiente.tipo !== TIPO_PASO.FIN) {
                const usuarios = await derivacionConfiguradaReplace(configuracionPasoSiguiente.id, idFlujoDocumental);
                if (Array.isArray(usuarios) && usuarios.length > 0) {
                  configuracionPasoSiguiente.usuariosDerivacion = usuarios;
                }
              }
              pasosSiguientesFinal.push(configuracionPasoSiguiente);
            }

            if ([TIPO_PASO.INTEROPERABILIDAD].includes(pasoElegido.tipo)) {
              const pasoDecision = await PasoRepository.findOne({ id: pasoSiguiente.pasoSiguiente.id });
              const pasoIop = pasoDecision.pasosSiguientes.find(x => x.idPasoSiguiente === camino);

              const { pasosSiguientes } = await PasoRepository.findOne({ id: pasoIop.pasoSiguiente.id });

              if (pasosSiguientes.length === 0) throw new Error('No existen pasos siguientes configurados.');

              if (pasosSiguientes.length === 1 && pasosSiguientes[0].pasoSiguiente.tipo === TIPO_PASO.FORMULARIO) {
                const pasoFormulario = pasosSiguientes[0].pasoSiguiente;
                pasoIop.pasoSiguiente.tipoFinalizacion = pasoFormulario.tipoFinalizacion;
                pasoIop.pasoSiguiente.idFormulario = pasoFormulario.idFormulario;
                pasoIop.pasoSiguiente.idTipoCargo = pasoFormulario.idTipoCargo;
                pasoIop.pasoSiguiente.dependenciaFuncional = pasoFormulario.dependenciaFuncional;
                pasoIop.pasoSiguiente.configuracionCargo = pasoFormulario.configuracionCargo;
              }

              const configuracionPasoSiguiente =  await getConfiguracionPaso(pasoIop.pasoSiguiente, idUsuario, idFlujoDocumental);
              pasosSiguientesFinal.push(configuracionPasoSiguiente);
            }
          }
        }
      }
    } catch (error) {
      console.log('==========_MENSAJE_A_MOSTRARSE_==========');
      console.log(error);
      console.log('==========_MENSAJE_A_MOSTRARSE_==========');
      throw new Error(error.message);
    }
  }

  async function derivacionConfiguradaReplace (idPasoSiguiente, idFlujo) {
    try {
      const paso = await PasoRepository.findOne({ id: idPasoSiguiente });

      if (!Array.isArray(paso.configuracion)) return [];

      const configuracion = paso?.configuracion?.map(
        x => (
          {
            reglas              : x.reglas?.filter(y => y.valorDestino === 'de'),
            idFormularioOrigen  : x.idFormularioOrigen,
            idFormularioDestino : x.idFormularioDestino
          })
      )?.filter(y => y.reglas?.length > 0);
      if (configuracion.length > 0) {
        const documentoOrigen = await DocumentoRepository.findOne({ idFlujo, plantilla: { id: configuracion[0].idFormularioOrigen } });
        if (documentoOrigen?.plantilla?.configuracion_json) {
          const valor = getValorCampo(documentoOrigen.plantilla.configuracion_json, configuracion[0].reglas[0]);
          if (Array.isArray(valor)) {
            return [valor.pop()];
          } else {
            return [valor];
          }
        }
      }
      return [];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async function pasosObservaciones (idFlujoDocumental, idUsuario) {
    try {
      const pasosObservacionFinal = [];
      const _existeFlujoDocumental = await FlujoDocumentalRepository.findOne({ id: idFlujoDocumental });
      for (const pasoActual of _existeFlujoDocumental.pasosActuales) {
        const pasosObservacion = await PasoActualRepository.findOne({ id: pasoActual.id });
        for (const pasoObservacion of pasosObservacion.pasoActual.pasosObservacion) {
          if (['formulario'].includes(pasoObservacion.pasoObservacion.tipo)) {
            const configuracionPasoObservacion = await getConfiguracionPaso(pasoObservacion.pasoObservacion, idUsuario, _existeFlujoDocumental.id);

            const { rows: derivaciones } = await FlujoDerivacionRepository.findAll({ idPaso: configuracionPasoObservacion.id, idFlujo: idFlujoDocumental, order: '-createdAt' });
            let tipo = 'DESTINATARIO';
            const existeUnRemitente = derivaciones.some(x => x.tipo === 'REMITENTE');
            if (existeUnRemitente) tipo = 'REMITENTE';

            const derivacionPaso = await FlujoDerivacionRepository.ultimaDerivacion({ idPaso: configuracionPasoObservacion.id, idFlujo: idFlujoDocumental, tipo  }, ['createdAt', 'DESC']);

            const { rows } = await UsuarioCargoRepository.findAll({ idCargo: derivacionPaso?.idCargoDestinatario, idUsuario: derivacionPaso?.idUsuarioDestinatario,  estado: 'ACTIVO' });

            if (rows.length > 0) {
              configuracionPasoObservacion.usuariosDerivacion = rows;
            }

            if (configuracionPasoObservacion.tipoFinalizacion === 'DERIVAR_DOCUMENTO') {
              pasosObservacionFinal.push(configuracionPasoObservacion);
            }
          }
        }
      }
      return pasosObservacionFinal;
    } catch (error) {
      console.log('ERROR EN PASO ACTUAL ', error);
      throw new Error(error.message);
    }
  }

  async function pasosCancelables (idFlujoDocumental, idUsuario) {
    try {
      const pasosSiguientesFinal = [];
      const _existeFlujoDocumental = await FlujoDocumentalRepository.findOne({ id: idFlujoDocumental });
      for (const pasoActual of _existeFlujoDocumental.pasosActuales) {
        const pasosSiguientes = await PasoActualRepository.findOne({ id: pasoActual.id });

        for (const pasoSiguiente of pasosSiguientes.pasoActual.pasosSiguientes) {
          if (['fallo'].includes(pasoSiguiente.pasoSiguiente.tipo)) {
            const configuracionPasoSiguiente = await getConfiguracionPaso(pasoSiguiente.pasoSiguiente, idUsuario, _existeFlujoDocumental.id);
            pasosSiguientesFinal.push(configuracionPasoSiguiente);
          }
        }
      }
      return pasosSiguientesFinal;
    } catch (error) {
      debug('ERROR EN PASO ACTUAL ', error);
      throw new Error(error.message);
    }
  }

  async function cancelarFlujo (params) {
    let transaccion;
    try {
      transaccion = await transaction.create();
      const pasoIOP = await PasoRepository.findOne({ id: params.idPaso });

      let respuestaIop = {
        envio               : 'SIN SERVICIO CONFIGURADO',
        respuesta           : 'SIN SERVICIO CONFIGURADO',
        respuestaFormateado : 'SIN SERVICIO CONFIGURADO'
      };

      if (pasoIOP.configuracion?.envio?.idServicio) {
        respuestaIop = await evaluarConfiguracionInteroperabilidad(params.id, pasoIOP.configuracion.envio, pasoIOP.configuracion.respuesta, transaccion);
      }

      await EjecucionInteroperabilidadRepository.createOrUpdate({
        idPaso      : params.idPaso,
        idFlujo     : params.id,
        ...respuestaIop,
        userCreated : params.idUsuario
      }, transaccion);

      await FlujoDocumentalRepository.createOrUpdate({
        id             : params.id,
        estado         : constants.ESTADO_FLUJO_DOCUMENTAL.CANCELADO,
        concluido      : true,
        proveidoCierre : params.motivo
      }, transaccion);

      const { rows: documentos } =  await DocumentoRepository.findAll({ idFlujo: params.id }, transaccion);
      const promesas = [];

      for (const documento of documentos) {
        promesas.push(DocumentoRepository.createOrUpdate({ id: documento.id, estado: constants.ESTADO_DOCUMENTO.CANCELADO }), transaccion);
      }

      const { rows } = await FlujoDerivacionRepository.findAll({ idFlujo: params.id }, transaccion);

      for (const flujoDerivacion of rows) {
        await FlujoDerivacionRepository.createOrUpdate({ id: flujoDerivacion.id, estadoActual: 'INACTIVO' }, transaccion);
      }

      promesas.push(await FlujoDerivacionRepository.createOrUpdate({
        idFlujo                   : params.id,
        idDocumento               : params.idDocumento,
        idAccion                  : null,
        idPaso                    : params.idPaso,
        observacion               : false,
        descripcion               : params.motivo,
        idUsuarioRemitente        : params.remitente.id,
        nombreRemitente           : params.remitente.nombre,
        idCargoRemitente          : params.remitente.idCargo,
        cargoRemitente            : params.remitente.cargo,
        idUsuarioDestinatario     : null,
        nombreDestinatario        : 'CANCELADO',
        idCargoDestinatario       : null,
        cargoDestinatario         : null,
        tipo                      : 'CANCELADO',
        urgente                   : false,
        fechaPlazo                : null,
        fechaDerivacion           : new Date(),
        fechaRecepcion            : new Date(),
        estadoActual              : 'INACTIVO',
        estado                    : 'DERIVADO',
        userCreated               : params.idUsuario,
        informacionComplementaria : params.informacionComplementaria
      }, transaccion));

      await Promise.all(promesas);
      await transaction.commit(transaccion);
      return true;
    } catch (error) {
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function cancelarFlujoNuevo (params) {
    let transaccion;
    try {
      transaccion = await transaction.create();
      // const pasoIOP = await PasoRepository.findOne({ id: params.idPaso });

      // let respuestaIop = {
      //   envio               : 'SIN SERVICIO CONFIGURADO',
      //   respuesta           : 'SIN SERVICIO CONFIGURADO',
      //   respuestaFormateado : 'SIN SERVICIO CONFIGURADO'
      // };

      // if (pasoIOP.configuracion?.envio?.idServicio) {
      //   respuestaIop = await evaluarConfiguracionInteroperabilidad(params.id, pasoIOP.configuracion.envio, pasoIOP.configuracion.respuesta, transaccion);
      // }

      // await EjecucionInteroperabilidadRepository.createOrUpdate({
      //   idPaso      : params.idPaso,
      //   idFlujo     : params.id,
      //   ...respuestaIop,
      //   userCreated : params.idUsuario
      // }, transaccion);

      await FlujoDocumentalRepository.createOrUpdate({
        id             : params.id,
        estado         : constants.ESTADO_FLUJO_DOCUMENTAL.CANCELADO,
        concluido      : true,
        proveidoCierre : params.motivo
      }, transaccion);

      const { rows: documentos } =  await DocumentoRepository.findAll({ idFlujo: params.id }, transaccion);
      const promesas = [];

      for (const documento of documentos) {
        promesas.push(DocumentoRepository.createOrUpdate({ id: documento.id, estado: constants.ESTADO_DOCUMENTO.CANCELADO }), transaccion);
      }

      const { rows } = await FlujoDerivacionRepository.findAll({ idFlujo: params.id }, transaccion);

      for (const flujoDerivacion of rows) {
        await FlujoDerivacionRepository.createOrUpdate({ id: flujoDerivacion.id, estadoActual: 'INACTIVO' }, transaccion);
      }

      promesas.push(await FlujoDerivacionRepository.createOrUpdate({
        idFlujo                   : params.id,
        idDocumento               : params.idDocumento,
        idAccion                  : null,
        // idPaso                    : params.idPaso,
        observacion               : false,
        descripcion               : params.motivo,
        idUsuarioRemitente        : params.remitente.id,
        nombreRemitente           : params.remitente.nombre,
        idCargoRemitente          : params.remitente.idCargo,
        cargoRemitente            : params.remitente.cargo,
        idUsuarioDestinatario     : null,
        nombreDestinatario        : 'CANCELADO',
        idCargoDestinatario       : null,
        cargoDestinatario         : null,
        tipo                      : 'CANCELADO',
        urgente                   : false,
        fechaPlazo                : null,
        fechaDerivacion           : new Date(),
        fechaRecepcion            : new Date(),
        estadoActual              : 'INACTIVO',
        estado                    : 'DERIVADO',
        userCreated               : params.idUsuario,
        informacionComplementaria : params.informacionComplementaria
      }, transaccion));

      await Promise.all(promesas);
      await transaction.commit(transaccion);
      return true;
    } catch (error) {
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function ejecutarIOP (params, usuarioActual, transaccion) {
    const pasoIOP = await PasoRepository.findOne({ id: params.idPaso });

    await ComponenteService.ejecutarInteroperabilidades(params.idDocumento, 'ejecutarDerivarDocumento', params.idUsuario, transaccion);

    await ComponenteService.ejecutarInteroperabilidades(params.idDocumento, 'ejecutarProveido', params.idUsuario, transaccion);

    const respuestaIop = await evaluarConfiguracionInteroperabilidad(params.id, pasoIOP.configuracion.envio, pasoIOP.configuracion.respuesta, usuarioActual, transaccion);

    await EjecucionInteroperabilidadRepository.createOrUpdate({
      idPaso      : params.idPaso,
      idFlujo     : params.id,
      ...respuestaIop,
      userCreated : params.idUsuario
    }, transaccion);

    const { configuracion: nodos } = await SolicitudPlantillaRepository.findOne({ id: params.idSolicitudPlantilla });

    const pasosSiguientesFinal = [];

    await pasosSiguientes({
      idFlujoDocumental : params.id,
      idUsuario         : params.idUsuario,
      idPaso            : params.idPaso,
      idPasoOrigen      : params.idPaso,
      nodos,
      pasosSiguientesFinal
    });

    const nuevoPasoActual = pasosSiguientesFinal[0];

    if (nuevoPasoActual.tipo === TIPO_PASO.INTEROPERABILIDAD) {
      await FlujoDerivacionRepository.createOrUpdate({
        idFlujo                   : params.id,
        idPaso                    : params.idPaso,
        idDocumento               : null,
        idUsuarioRemitente        : null,
        nombreRemitente           : 'SISTEMA ZERO',
        cargoRemitente            : 'INTEROPERABILIDAD',
        idCargoRemitente          : null,
        idUsuarioDestinatario     : null,
        nombreDestinatario        : 'SISTEMA ZERO',
        cargoDestinatario         : 'INTEROPERABILIDAD',
        idCargoDestinatario       : null,
        idAccion                  : TIPOS_DERIVACIONES.PROVEIDO,
        descripcion               : 'Intercambio de informacion entre sistemas',
        fechaRecepcion            : new Date(),
        fechaDerivacion           : new Date(),
        observacion               : false,
        urgente                   : true,
        fechaPlazo                : null,
        tipo                      : 'PROVEIDO',
        estado                    : 'DERIVADO',
        estadoActual              : 'INACTIVO',
        etapa                     : 'FIN',
        informacionComplementaria : {},
        userCreated               : params.idUsuario
      }, transaccion);

      params.idPaso = nuevoPasoActual.id;
      return await ejecutarIOP(params, usuarioActual, transaccion);
    }

    return nuevoPasoActual;
  }

  async function verificarCite (params, transaccion) {
    const documento = await DocumentoRepository.findOne({ id: params.idDocumento }, transaccion);

    if (!documento)  throw new Error('El documento no existe.');

    if (!documento.cite) {
      const { codigoDocumento } = await CorrelativoService.generarCodigos({
        idUsuario         : params.idUsuario,
        idFormulario      : documento.plantilla?.id,
        idCategoria       : documento.plantilla?.idCategoria || null,
        documento         : true,
        userCreated       : params.idUsuario,
        citeInstitucional : documento.plantilla?.citeInstitucional || false
      }, transaccion);

      await DocumentoRepository.createOrUpdate({
        id             : documento.id,
        cite           : codigoDocumento,
        hojaRuta       : documento?.flujoDocumental.codigoFlujo,
        idFlujo        : params.id,
        editable       : false,
        fechaDocumento : new Date(),
        userUpdated    : params.idUsuario
      }, transaccion);
    }
  }

  async function ejecutarPasoIOP (params, usuarioActual) {
    let transaccion;
    try {
      transaccion = await transaction.create();
      const { documento, flujoDocumental } = await verificarHojaRutaCite({
        id          : params.idDerivacion,
        userUpdated : params.idUsuario,
        userCreated : params.idUsuario,
        remitente   : params.remitente
      }, transaccion);

      const paramsOriginal = JSON.parse(JSON.stringify(params));

      await verificarCite(paramsOriginal, transaccion);

      const datosRemitente = await getDatosUsuario(params.idUsuario);

      await FlujoDerivacionRepository.createOrUpdate({
        idFlujo                   : params.id,
        idPaso                    : params.idPaso,
        idDocumento               : null,
        idUsuarioRemitente        : datosRemitente.id,
        nombreRemitente           : datosRemitente.nombre,
        cargoRemitente            : datosRemitente.cargo,
        idCargoRemitente          : datosRemitente.idCargo,
        idUsuarioDestinatario     : null,
        nombreDestinatario        : 'SISTEMA ZERO',
        cargoDestinatario         : '',
        idCargoDestinatario       : null,
        idAccion                  : TIPOS_DERIVACIONES.PROVEIDO,
        descripcion               : params.descripcion || 'Intercambio de informacion entre sistemas',
        fechaRecepcion            : new Date(),
        fechaDerivacion           : new Date(),
        observacion               : false,
        urgente                   : true,
        fechaPlazo                : null,
        tipo                      : 'PROVEIDO',
        estado                    : 'DERIVADO',
        estadoActual              : 'INACTIVO',
        etapa                     : 'FIN',
        informacionComplementaria : {},
        userCreated               : params.idUsuario
      }, transaccion);

      const pasoFormulario = await ejecutarIOP(params, usuarioActual, transaccion);

      let destinatario = {};

      if (![TIPO_PASO.FIN, TIPO_PASO.ARCHIVAR].includes(pasoFormulario.tipo)) {
        if (!pasoFormulario.usuariosDerivacion[0]?.idUsuario && !params.destinatario) throw new Error('No existen usuarios a los que se pueda derivar.');
        destinatario = params.destinatario || await getDatosUsuario(pasoFormulario.usuariosDerivacion[0]?.idUsuario);
      }

      let nuevaDerivacion = {
        idFlujo              : paramsOriginal.id,
        idPaso               : paramsOriginal.idPaso,
        idDocumento          : paramsOriginal.idDocumento,
        idPlantillaDocumento : paramsOriginal.idPlantillaDocumento,
        remitente            : {
          id      : null,
          nombre  : 'SISTEMA ZERO',
          idCargo : null,
          cargo   : ''
        },
        destinatario: {
          id      : destinatario.id,
          nombre  : destinatario.nombre,
          idCargo : destinatario.idCargo,
          cargo   : destinatario.cargo
        },
        idAccion                  : TIPOS_DERIVACIONES.PROVEIDO,
        descripcion               : params.descripcion || 'Intercambio de informacion entre sistemas',
        fechaRecepcion            : new Date(),
        fechaDerivacion           : new Date(),
        observacion               : false,
        urgente                   : true,
        fechaPlazo                : null,
        tipo                      : 'PROVEIDO',
        estado                    : 'DERIVADO',
        estadoActual              : 'INACTIVO',
        etapa                     : 'FIN',
        informacionComplementaria : {},
        idUsuario                 : params.idUsuario
      };

      if (TIPOS_DERIVACIONES.CERRAR === pasoFormulario.idAccion)  {
        nuevaDerivacion =  await DerivacionService.cerrar(nuevaDerivacion, transaccion);
        await FlujoDocumentalRepository.createOrUpdate({
          id             : flujoDocumental.id,
          concluido      : true,
          proveidoCierre : paramsOriginal.descripcion,
          estado         : 'FINALIZADO'
        }, transaccion);
      }

      if (TIPOS_DERIVACIONES.ARCHIVAR === pasoFormulario.idAccion)  {
        nuevaDerivacion =  await DerivacionService.archivar(nuevaDerivacion, transaccion);
        await FlujoDocumentalRepository.createOrUpdate({
          id             : flujoDocumental.id,
          concluido      : true,
          proveidoCierre : paramsOriginal.descripcion,
          idCarpeta      : paramsOriginal.idCarpeta,
          estado         : 'ARCHIVADO'
        }, transaccion);
      }

      if (TIPOS_DERIVACIONES.PROVEIDO === pasoFormulario.idAccion)  nuevaDerivacion = await DerivacionService.derivarProveido(nuevaDerivacion, transaccion);

      if ([TIPOS_DERIVACIONES.DERIVAR_DOCUMENTO, TIPOS_DERIVACIONES.CREAR_DOCUMENTO].includes(pasoFormulario.idAccion)) {
        nuevaDerivacion.idPlantillaDocumento = pasoFormulario.idFormulario;
        nuevaDerivacion = await DerivacionService.derivarNuevoDocumento(nuevaDerivacion, transaccion);
      }

      await PasoActualRepository.deleteItemCond({ idFlujoDocumental: params.id, userDeleted: params.idUsuario }, transaccion);
      await PasoActualRepository.createOrUpdate({ idFlujoDocumental: params.id, idPaso: pasoFormulario.id, userCreated: params.idUsuario }, transaccion);

      const remitenteInicial = documento.configuracionDerivaciones.find(x => x.inicial);
      console.log(`========================================== ES REMITENTE INICIAL:  ${remitenteInicial?.idUsuario === params.idUsuario}`);
      if (remitenteInicial?.idUsuario === params.idUsuario) {
        console.log('========================================_REMNITENTE_INICIAL_', `${remitenteInicial.nombreUsuario} `);
        const { fileStoragePath } = config.app;
        const documentoPdf = await DocumentoRepository.findOne({ id: documento.id }, transaccion);
        const folder = `${fileStoragePath}/documentos/temporales`;
        if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder);
        }
        fs.writeFileSync(`${folder}/${documento.id}.json`, JSON.stringify(documentoPdf));
        await DocumentoService.generarPdf(documento.id, false);
      }

      await DocumentoRepository.createOrUpdate({ id: documento.id, estado: 'DERIVADO', editable: false }, transaccion);

      const linkRedireccion = await registrarAprobacionCiudadania({ documento, idUsuario: params.idUsuario, tipo: params.tipo, token: params.token }, false, transaccion);

      await transaction.commit(transaccion);

      await DocumentoRepository.createOrUpdate({ id: documento.id, estado: 'CERRADO', editable: false });

      return linkRedireccion;
    } catch (error) {
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function getDatosUsuario (idUsuario) {
    const usuario = await UsuarioRepository.findOne({ id: idUsuario });
    if (!usuario) throw new Error('El usuario no existe');
    return {
      id      : usuario.id,
      nombre  : `${usuario.nombres} ${usuario.primerApellido} ${usuario.segundoApellido}`,
      idCargo : usuario.cargoUsuario?.id,
      cargo   : usuario.cargoUsuario.descripcion
    };
  }

  async function documentosAdjuntos (idFlujoDocumental) {
    try {
      const { rows } = await DocumentoRepository.findByFlujoDocumental(idFlujoDocumental);
      return rows;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  return {
    ejecutarPasoIOP,
    getConfiguracionPaso,
    getDocumentoActual,
    parsearDerivacion,
    documentosAdjuntos,
    ejecutarIOP,
    cancelarFlujo,
    cancelarFlujoNuevo,
    pasosCancelables,
    pasosObservaciones,
    pasosSiguientes,
    findPasoActual,
    findOne,
    findAll,
    createOrUpdate,
    deleteItem
  };
};
