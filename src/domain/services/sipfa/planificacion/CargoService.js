'use strict';

const debug = require('debug')('app:service:auth');
const { ID_PERSONAL_PLANTA } = require('../../../../common/config/constants');
const { ErrorApp } = require('../../../lib/error');
module.exports = function CargoRepository (repositories) {
  const { CargoRepository } = repositories.planificacion;
  const { UsuarioCargoRepository, EntidadRepository, AreaRepository, transaction } = repositories;
  const { ConfiguracionCargoRepository } = repositories.planificacion;

  async function findAll (params) {
    try {
      const cargo = await CargoRepository.findAll(params);
      return cargo;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function findOne (params) {
    try {
      const cargo = await CargoRepository.findOne(params);
      if (!cargo) {
        throw new Error('El cargo no existe');
      }
      return cargo;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function createOrUpdate (datos) {
    let transaccion;
    try {
      transaccion = await transaction.create();
      const cargo = await CargoRepository.createOrUpdate(datos, transaccion);

      const { configuracionCargo } = datos;
      if (configuracionCargo) {
        const existeConfiguracionCargo = await ConfiguracionCargoRepository.findOne({ idCargo: cargo.id }, transaccion);
        configuracionCargo.idCargo = cargo.id;
  
        if (existeConfiguracionCargo) {
          configuracionCargo.id = existeConfiguracionCargo.id;
          configuracionCargo.userUpdated = datos.userCreated || datos.userUpdated;
        }
  
        if (!existeConfiguracionCargo) configuracionCargo.userCreated = datos.userCreated || datos.userUpdated;
  
        await ConfiguracionCargoRepository.createOrUpdate(configuracionCargo, transaccion);
      }
      await transaction.commit(transaccion);
      return cargo;
    } catch (error) {
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function eliminar (id) {
    try {
      const cargo = await CargoRepository.deleteItem(id);
      return cargo;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function dependencias (params) {
    try {
      const cargo = await CargoRepository.findOne({ id: params });
      if (!cargo) {
        throw new Error('El cargo no existe');
      }
      const dependientes = await UsuarioCargoRepository.findDependientes({ idDepenenciaLinea: params });
      dependientes.unidad = cargo.unidad;
      return dependientes;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function importar (cargos) {
    let transaccion;
    try {
      transaccion = await transaction.create();

      for (let index = 0; index < cargos.length; index++) {
        const cargo = cargos[index];
        cargo.errores = [];

        const existeEntidad = await EntidadRepository.findOne({ codigo: cargo.codigoEntidad }, transaccion);

        if (!existeEntidad) cargo.errores.push(`No existe la entidad con el codigo ${cargo.codigoEntidad}`);

        if (existeEntidad) {
          const existeArea = await AreaRepository.findOne({ idEntidad: existeEntidad.id, sigla: cargo.siglaArea });

          if (!existeArea) cargo.errores.push(`No existe la area/unidad con la sigla ${cargo.siglaArea}`);

          if (existeArea) {
            const existeCargo = await CargoRepository.existe({ id: cargo.id, nroItem: cargo.nroItem, idUnidadOrganizacional: existeArea.id }, transaccion);

            if (existeCargo) cargo.errores.push('El cargo ya fue registrado anteriormente');

            if (!existeCargo) {
              const configuracionCargo = {
                idCargo                  : null,
                idDepenenciaLinea        : null,
                idDependenciaFuncional   : null,
                idDependenciaFormulario  : null,
                idDependenciaPoai        : null,
                idApruebaViaje           : null,
                idElaboraMemorandumViaje : null,
                idUnidadOrganizacional   : existeArea.id
              };

              const {
                itemApruebaViaje,
                itemElaboraMemorandumViaje,
                itemDependenciaFuncional,
                itemDependenciaLineal,
                itemDependenciaFormulario,
                itemDependenciaPoai
              } = cargo;

              if (itemApruebaViaje) {
                const existeApruebaViaje = await CargoRepository.findOne({ idUnidadOrganizacional: existeArea.id, nroItem: itemApruebaViaje, estado: 'ACTIVO' }, transaccion);
                if (existeApruebaViaje) configuracionCargo.idApruebaViaje = existeApruebaViaje.id;
              }

              if (itemElaboraMemorandumViaje) {
                const existeElaboraMemorandumViaje = await CargoRepository.findOne({ idUnidadOrganizacional: existeArea.id, nroItem: itemElaboraMemorandumViaje, estado: 'ACTIVO' }, transaccion);
                if (existeElaboraMemorandumViaje) configuracionCargo.idElaboraMemorandumViaje = existeElaboraMemorandumViaje.id;
              }

              if (itemDependenciaFuncional) {
                const existeDependenciaFuncional = await CargoRepository.findOne({ idUnidadOrganizacional: existeArea.id, nroItem: itemDependenciaFuncional, estado: 'ACTIVO' }, transaccion);
                if (existeDependenciaFuncional) configuracionCargo.idDependenciaFuncional = existeDependenciaFuncional.id;
              }

              if (itemDependenciaLineal) {
                const existeDependenciaLineal = await CargoRepository.findOne({ idUnidadOrganizacional: existeArea.id, nroItem: itemDependenciaLineal, estado: 'ACTIVO' }, transaccion);
                if (existeDependenciaLineal) configuracionCargo.idDepenenciaLinea = existeDependenciaLineal.id;
              }

              if (itemDependenciaFormulario) {
                const existeDepenenciaFormulario = await CargoRepository.findOne({ idUnidadOrganizacional: existeArea.id, nroItem: itemDependenciaFormulario, estado: 'ACTIVO' }, transaccion);
                if (existeDepenenciaFormulario) configuracionCargo.idDependenciaFormulario = existeDepenenciaFormulario.id;
              }

              if (itemDependenciaPoai) {
                const existeDependenciaPoai = await CargoRepository.findOne({ idUnidadOrganizacional: existeArea.id, nroItem: itemDependenciaPoai, estado: 'ACTIVO' }, transaccion);
                if (existeDependenciaPoai) configuracionCargo.idDependenciaPoai = existeDependenciaPoai.id;
              }

              cargo.idUnidadOrganizacional = existeArea.id;
              cargo.idTipoPuesto = ID_PERSONAL_PLANTA;

              const cargoCreado = await CargoRepository.createOrUpdate(cargo, transaccion);

              configuracionCargo.idUnidadOrganizacional = existeArea.id;
              configuracionCargo.idCargo = cargoCreado.id;
              configuracionCargo.userCreated = cargo.userCreated;

              await ConfiguracionCargoRepository.createOrUpdate(configuracionCargo, transaccion);

              if (existeCargo) cargo.errores.push('El cargo ya fue registrado anteriormente');
            }
          }
        }
      }

      await transaction.commit(transaccion);
      return cargos;
    } catch (error) {
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  return {
    importar,
    findOne,
    eliminar,
    createOrUpdate,
    findAll,
    dependencias
  };
};
