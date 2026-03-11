'use strict';

const debug = require('debug')('app:service:formulario');
const { ErrorApp } = require('../../lib/error');
const uuid = require('uuid');

module.exports = function solicitudPlantillaService (repositories) {
  const {
    SolicitudPlantillaRepository,
    PasoRepository,
    PasoSiguienteRepository,
    PasoAnteriorRepository,
    PasoObservacionRepository,
    transaction,
    EntidadRepository,
    PermisoSolicitudRepository,
    AreaRepository
  } = repositories;

  async function findAll (params) {
    try {
      const solicitudesPlantilla =  await SolicitudPlantillaRepository.findAll(params);
      return solicitudesPlantilla;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function findPasosIniciales (idSolicitudPlantilla) {
    try {
      const _existeSolicitudPlantilla = await SolicitudPlantillaRepository.findOne({ id: idSolicitudPlantilla });

      if (!_existeSolicitudPlantilla) throw new Error('No existe la solicitud plantilla, buscada');

      if (_existeSolicitudPlantilla.pasos.length === 0) throw new Error(`El flujo "${_existeSolicitudPlantilla.nombre}" no tiene configurado correctamente sus pasos.`);

      const pasoInicio = _existeSolicitudPlantilla.pasos.find(x => x.pasosAnteriores.length === 0);

      const paso = await PasoRepository.findOne({ id: pasoInicio.id });
      const pasosSiguientes = paso.pasosSiguientes.map(x => ({ id: x.pasoSiguiente.id, nombre: x.pasoSiguiente.nombrePaso }));
      return pasosSiguientes;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function createOrUpdate (data) {
    debug('Crear o actualizar formulario');
    let solicitudPlantilla;
    let transaccion;
    try {
      transaccion = await transaction.create();

      solicitudPlantilla = await SolicitudPlantillaRepository.createOrUpdate(data, transaccion);

      if (data.pasosEliminar) {
        for (const id of data.pasosEliminar) {
          await PasoRepository.deleteItem(id, transaccion);
        }
      }

      if (data.pasos) {
        for (const paso of data.pasos) {
          await PasoRepository.createOrUpdate({
            id                   : paso.id,
            configuracion        : paso.configuracion,
            nombrePaso           : paso.nombrePaso,
            mostrarEntidad       : paso.mostrarEntidad,
            recuperarDocumento   : paso.recuperarDocumento,
            idEntidad            : paso.idEntidad,
            idFormulario         : paso.idFormulario,
            multiplesFormularios : paso.multiplesFormularios,
            listaFormularios     : paso.listaFormularios,
            idTipoCargo          : paso.idTipoCargo,
            campo                : paso.campo,
            configuracionCargo   : paso.configuracionCargo,
            dependenciaFuncional : paso.dependenciaFuncional,
            proveidoDefecto      : paso.proveidoDefecto,
            tipo                 : paso.tipo,
            tipoFinalizacion     : paso.tipoFinalizacion,
            idSolicitudPlantilla : solicitudPlantilla.id,
            userCreated          : data.userCreated || data.userUpdated
          }, transaccion);
        }

        for (const paso of data.pasos) {
          await PasoSiguienteRepository.deleteItemCond({ idPaso: paso.id }, transaccion);
          for (const siguiente of paso.pasosSiguientes) {
            await PasoSiguienteRepository.createOrUpdate({
              idPaso          : paso.id,
              idPasoSiguiente : siguiente,
              userCreated     : data.userCreated || data.userUpdated
            }, transaccion);
          }

          await PasoAnteriorRepository.deleteItemCond({ idPaso: paso.id }, transaccion);
          for (const anterior of paso.pasosAnteriores) {
            await PasoAnteriorRepository.createOrUpdate({
              idPaso         : paso.id,
              idPasoAnterior : anterior,
              userCreated    : data.userCreated || data.userUpdated
            }, transaccion);
          }

          await PasoObservacionRepository.deleteItemCond({ idPaso: paso.id }, transaccion);
          for (const observacion of paso.pasosObservacion) {
            await PasoObservacionRepository.createOrUpdate({
              idPaso            : paso.id,
              idPasoObservacion : observacion,
              userCreated       : data.userCreated || data.userUpdated
            }, transaccion);
          }
        }
      }

      if (data.permisosAreas) {
        await PermisoSolicitudRepository.deletePermisos({
          idSolicitudPlantilla : solicitudPlantilla.id,
          userDeleted          : data.userCreated || data.userUpdated,
          tipo                 : 'AREA'
        }, transaccion);
        for (const permisoArea of data.permisosAreas) {
          await PermisoSolicitudRepository.createOrUpdate({
            idSolicitudPlantilla : solicitudPlantilla.id,
            idArea               : permisoArea.id,
            userCreated          : data.userCreated || data.userUpdated
          }, transaccion);
        }
      }

      if (data.permisosEntidades) {
        await PermisoSolicitudRepository.deletePermisos({
          idSolicitudPlantilla : solicitudPlantilla.id,
          userDeleted          : data.userCreated || data.userUpdated,
          tipo                 : 'ENTIDAD'
        }, transaccion);
        for (const permisoEntidad of data.permisosEntidades) {
          await PermisoSolicitudRepository.createOrUpdate({
            idSolicitudPlantilla : solicitudPlantilla.id,
            idEntidad            : permisoEntidad.id,
            userCreated          : data.userCreated || data.userUpdated
          }, transaccion);
        }
      }

      await transaction.commit(transaccion);
      return solicitudPlantilla;
    } catch (error) {
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function listarPermisosEntidad (idSolicitudPlantilla) {
    try {
      const { rows: entidades } = await EntidadRepository.findAll();

      let permisosSolicitud = [];

      if (idSolicitudPlantilla) ({ rows: permisosSolicitud } = await PermisoSolicitudRepository.findPermisosEntidades({ idSolicitudPlantilla }));
      const permisos = [];
      for (const entidad of entidades) {
        permisos.push({
          id          : entidad.id,
          sigla       : entidad.sigla,
          nombre      : entidad.nombre,
          descripcion : entidad.descripcion,
          permitido   : Boolean(permisosSolicitud.find(x => x.idEntidad.toString() === entidad.id.toString()))
        });
      }
      return permisos;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function listarPermisosAreas (idSolicitudPlantilla) {
    try {
      const { rows: areas } = await AreaRepository.findAll();
      let permisosSolicitud = [];

      if (idSolicitudPlantilla) ({ rows: permisosSolicitud } = await PermisoSolicitudRepository.findPermisosAreas({ idSolicitudPlantilla }));

      const permisos = [];

      for (const area of areas) {
        permisos.push({
          id          : area.id,
          sigla       : area.sigla,
          nombre      : area.nombre_area,
          descripcion : area.descripcion,
          permitido   : Boolean(permisosSolicitud.find(x => x.idArea === area.id))
        });
      }
      return permisos;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function findOne (params) {
    debug('Crear o actualizar formulario');
    let solicitudPlantilla;
    try {
      solicitudPlantilla = await SolicitudPlantillaRepository.findOne(params);

      if (!solicitudPlantilla) throw new Error('No existe o no se puede encontrar la solicitud plantilla solicitada.');

      return solicitudPlantilla;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function deleteItem (id) {
    debug('Eliminando formulario', id);
    try {
      const resultado = await SolicitudPlantillaRepository.deleteItem(id);
      return resultado;
    } catch (err) {
      debug(err);
      throw new ErrorApp(err.message, 400);
    }
  }

  async function generarUUID () {
    let yaExistePaso = null;
    let nuevaUUID = null;
    do {
      nuevaUUID = uuid.v4();
      yaExistePaso = await PasoRepository.findOne({ id: nuevaUUID });
    } while (yaExistePaso);

    return nuevaUUID;
  }

  function cambiarUUID (pasoActual, equivalencias) {
    const paso = JSON.parse(JSON.stringify(pasoActual));

    const reemplazo = equivalencias.find(x => x.origen === paso.id);

    if (!reemplazo) throw new Error('Error al reemplazar los identificadores de los pasos.');

    paso.id = reemplazo.destino;

    if (paso.outputs?.output_1?.connections && Array.isArray(paso.outputs?.output_1?.connections)) {
      for (const output of paso.outputs?.output_1?.connections) {
        const reemplazoOutput = equivalencias.find(x => x.origen === output.node);

        if (!reemplazoOutput) throw new Error('Error al reemplazar los identificadores de los enlaces de salida.');

        output.node = reemplazoOutput.destino;
      }
    }
    if (paso.outputs?.output_2?.connections && Array.isArray(paso.outputs?.output_2?.connections)) {
      for (const output of paso.outputs?.output_2?.connections) {
        const reemplazoOutput = equivalencias.find(x => x.origen === output.node);

        if (!reemplazoOutput) throw new Error('Error al reemplazar los identificadores de los enlaces de salida.');

        output.node = reemplazoOutput.destino;
      }
    }

    if (paso.outputs?.output_3?.connections && Array.isArray(paso.outputs?.output_3?.connections)) {
      for (const output of paso.outputs?.output_3?.connections) {
        const reemplazoOutput = equivalencias.find(x => x.origen === output.node);

        if (!reemplazoOutput) throw new Error('Error al reemplazar los identificadores de los enlaces de salida.');

        output.node = reemplazoOutput.destino;
      }
    }

    if (paso.inputs?.input_1?.connections && Array.isArray(paso.inputs?.input_1?.connections)) {
      for (const input of paso.inputs?.input_1?.connections) {
        const reemplazoInput = equivalencias.find(x => x.origen === input.node);

        if (!reemplazoInput) throw new Error('Error al reemplazar los identificadores de los enlaces de entrada.');

        input.node = reemplazoInput.destino;
      }
    }
    return paso;
  }

  async function clonarsolicitudPlantilla (params) {
    debug('Crear o actualizar formulario');
    let solicitudPlantilla;
    try {
      const existePlantillaOriginal = await SolicitudPlantillaRepository.findOne({ id: params.id });

      if (!existePlantillaOriginal) throw new Error('No existe la plantilla a clonar');
      const equivalencias = [];
      for (const key in existePlantillaOriginal.configuracion) {
        const nuevaUUID = await generarUUID();
        equivalencias.push({ origen: key, destino: nuevaUUID });
      }

      const nuevaPlantilla = JSON.parse(JSON.stringify(existePlantillaOriginal));
      nuevaPlantilla.configuracion = {};
      delete nuevaPlantilla.id;
      delete nuevaPlantilla.createdAt;
      delete nuevaPlantilla.updateAt;
      nuevaPlantilla.userCreated = params.userCreated;
      nuevaPlantilla.nombre = params.titulo;
      nuevaPlantilla.descripcion = params.titulo;

      for (const key in existePlantillaOriginal.configuracion) {
        const existeReemplazo = equivalencias.find(x => x.origen === key);

        if (!existeReemplazo) throw new Error('Error al reemplazar los identificadores de los pasos.');

        nuevaPlantilla.configuracion[existeReemplazo.destino] = cambiarUUID(existePlantillaOriginal.configuracion[key], equivalencias);
      }

      solicitudPlantilla = await SolicitudPlantillaRepository.createOrUpdate(nuevaPlantilla);
      return solicitudPlantilla;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  return {
    listarPermisosEntidad,
    listarPermisosAreas,
    clonarsolicitudPlantilla,
    findPasosIniciales,
    findOne,
    findAll,
    createOrUpdate,
    deleteItem
  };
};
