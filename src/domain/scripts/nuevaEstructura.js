const db = require('../../infrastructure');
const { config, errors } = require('../../common');
const fs = require('fs');
const fspromises = require('fs/promises');

(async function () {
  const repositories = await db(config.db).catch(errors.handleFatalError);
  const {
    UsuarioRepository,
    AreaRepository
  } = repositories;
  const { CargoRepository, ConfiguracionCargoRepository } = repositories.planificacion;

  try {

    const cargos = 'ESTRUCTURA_2025.json';
    const data = await fspromises.readFile(cargos, 'utf8');
    let datosActualizar = JSON.parse(data);
    const usuarios = [];
    const documentos = [];

    for(const dato of datosActualizar){
        let esNuevo = true;
        let idCargo = null;
        if (dato.APELLIDO_PATERNO !== 'ACEFALO') {
            let usuario = await UsuarioRepository.findOne({
                numeroDocumento: dato.NRO_DOCUMENTO
            })
            if (!usuario) {
                usuario = await UsuarioRepository.findOne({
                    nombres: dato.NOMBRES,
                    primerApellido: dato.APELLIDO_PATERNO,
                    segundoApellido: dato.APELLIDO_MATERNO
                })
                documentos.push({
                    nombres: dato.NOMBRES,
                    primerApellido: dato.APELLIDO_PATERNO,
                    segundoApellido: dato.APELLIDO_MATERNO
                })
            }
            if (usuario) {
                esNuevo = false;
                const cargo = await  CargoRepository.findOne({
                    id: usuario?.cargoUsuario?.id ?? null
                })
                idCargo = cargo?.id ?? null;
                if (cargo && (cargo.nroItem !== dato.NRO_ITEM || cargo.descripcion !== dato.DESCRIPCION_DEL_CARGO)) {
                    idCargo = cargo?.id;
                    console.log('CARGO MODIFICADO', {
                        id: cargo.id,
                        nroItem: dato.NRO_ITEM,
                        descripcion: dato.DESCRIPCION_DEL_CARGO,
                        idTipoPuesto: '760f0dd0-59ef-4c6c-bdf5-1277992054b1',
                        usuario: usuario.numeroDocumento
                    });                    
                    await CargoRepository.createOrUpdate({
                        id: cargo.id,
                        nroItem: dato.NRO_ITEM,
                        descripcion: dato.DESCRIPCION_DEL_CARGO
                    })
                }
            } else {
                usuarios.push({
                    NRO_DOCUMENTO: dato.NRO_DOCUMENTO,
                    NOMBRES: dato.NOMBRES,
                    APELLIDO_PATERNO: dato.APELLIDO_PATERNO,
                    APELLIDO_MATERNO: dato.APELLIDO_MATERNO,
                    NRO_ITEM: dato.NRO_ITEM,
                    DESCRIPCION_DEL_CARGO: dato.DESCRIPCION_DEL_CARGO
                })
            }
        }
        const area = await AreaRepository.findOne({
            sigla: dato.UNIDAD
        })
        if (esNuevo) {
            const nuevoCargo = await CargoRepository.createOrUpdate({
                nroItem: dato.NRO_ITEM,
                descripcion: dato.DESCRIPCION_DEL_CARGO,
                nivel: dato.NIVEL,
                idTipoPuesto: '760f0dd0-59ef-4c6c-bdf5-1277992054b1',
                idUnidadOrganizacional: area.id,
                userCreated: '7171272e-b31b-4c34-9220-9f535c958c5c',
                createdAt: (new Date().toISOString())
            })
            idCargo = nuevoCargo?.id;
            console.log('CARGO CREADO', {
                nroItem: dato.NRO_ITEM,
                descripcion: dato.DESCRIPCION_DEL_CARGO,
                area: area.nombreArea
            });  
        }
        const cargoDependencia = await CargoRepository.findOne({
            descripcion: dato.DEPENDENCIA
        })
        if (cargoDependencia && idCargo) {
            const ultimaConfiguration = await ConfiguracionCargoRepository.findOne({
                idCargo: idCargo
            })
            const datosConfiguracion = {
                idCargo: idCargo,
                idDepenenciaLinea: cargoDependencia.id,
                idDependenciaFuncional: cargoDependencia.id,
                idDependenciaFuncional: cargoDependencia.id,
                idDependenciaFormulario: cargoDependencia.id,
                idDependenciaPoai: cargoDependencia.id,
                idApruebaViaje: cargoDependencia.id,
                idElaboraMemorandumViaje: cargoDependencia.id,
                idUnidadOrganizacional: area.id
            }
            if (ultimaConfiguration) {
                datosConfiguracion.id = ultimaConfiguration.id
                datosConfiguracion.userUpdated = '7171272e-b31b-4c34-9220-9f535c958c5c'
                datosConfiguracion.updatedAt = (new Date().toISOString())
            } else {
                datosConfiguracion.userCreated = '7171272e-b31b-4c34-9220-9f535c958c5c',
                datosConfiguracion.createdAt = (new Date().toISOString())
            }
            await ConfiguracionCargoRepository.createOrUpdate(datosConfiguracion)
        }
    }
    console.log('USUARIOS A MODIFICAR MANUALMENTE', usuarios);
    console.log('USUARIOS A MODIFICAR MANUALMENTE - DOCUMENTOS', documentos);
    return;
  } catch (error) {
    console.error(error.message);
  }
})();
