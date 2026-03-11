'use strict';

const debug = require('debug')('app:service:formulario');
const { ErrorApp } = require('../../lib/error');

module.exports = function formularioService (repositories, helpers, res) {
  const {
    FormularioRepository,
    transaction,
    FormularioComponenteRepository,
    EntidadRepository,
    AreaRepository,
    PermisoFormularioRepository
  } = repositories;

  async function listar (params) {
    try {
      const formularios =  await FormularioRepository.findAll(params);
      return formularios;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function listarCampos (params) {
    try {
      const { rows } =  await FormularioRepository.findAllComplete(params);
      const respuesta = [];
      for (const formulario of rows) {
        const datosFormulario = {
          id     : formulario.id,
          nombre : formulario.nombre,
          campos : []
        };
        for (const campo of formulario.configuracion_json) {
          if (campo.subCampos) {
            for (const subCampo of campo.subCampos) {
              datosFormulario.campos.push({
                idFormulario    : formulario.id,
                siglaFormulario : formulario.sigla,
                id              : campo.uid,
                name            : campo.name,
                type            : campo.type,
                subCampo        : subCampo
              });
            }
          } else {
            datosFormulario.campos.push({
              idFormulario    : formulario.id,
              siglaFormulario : formulario.sigla,
              id              : campo.uid,
              name            : campo.name,
              type            : campo.type,
              subCampo        : 'value'
            });
          }
        }
        respuesta.push(datosFormulario);
      }
      return respuesta;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function listarFormulario (params) {
    try {
      const formularios =  FormularioRepository.findListAll(params);
      return formularios;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function listarpor (params) {
    try {
      const formulario = await FormularioRepository.findOne(params);
      if (!formulario) {
        throw new Error('El formulario no existe');
      }
      return formulario;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function createOrUpdate (data) {
    debug('Crear o actualizar formulario');
    let formulario;
    let transaccion;
    try {
      transaccion = await transaction.create();

      formulario = await FormularioRepository.createOrUpdate(data, transaccion);

      if (data.permisosAreas) {
        await PermisoFormularioRepository.deletePermisos({
          idFormulario : formulario.id,
          userDeleted  : data.userCreated || data.userUpdated,
          tipo         : 'AREA'
        }, transaccion);
        for (const permisoArea of data.permisosAreas) {
          await PermisoFormularioRepository.createOrUpdate({
            idFormulario : formulario.id,
            idArea       : permisoArea.id,
            userCreated  : data.userCreated || data.userUpdated
          }, transaccion);
        }
      }

      if (data.permisosEntidades) {
        await PermisoFormularioRepository.deletePermisos({
          idFormulario : formulario.id,
          userDeleted  : data.userCreated || data.userUpdated,
          tipo         : 'ENTIDAD'
        }, transaccion);
        for (const permisoEntidad of data.permisosEntidades) {
          await PermisoFormularioRepository.createOrUpdate({
            idFormulario : formulario.id,
            idEntidad    : permisoEntidad.id,
            userCreated  : data.userCreated || data.userUpdated
          }, transaccion);
        }
      }
      await transaction.commit(transaccion);
      return formulario;
    } catch (error) {
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function deleteItem (id) {
    debug('Eliminando formulario', id);
    try {
      const resultado = await FormularioRepository.deleteItem(id);
      return resultado;
    } catch (err) {
      debug(err);
      throw new ErrorApp(err.message, 400);
    }
  }
  async function getFormulariosComponentes (componentes) {
    const idComponentes = componentes.map(x => x.id);
    const { rows } = await FormularioRepository.findByComponentes(idComponentes);
    return rows;
  }

  async function createOrUpdateCompleto (data) {
    let transaccion;
    try {
      transaccion = await transaction.create();
      data.id_cite_plantilla = 1;

      /// Guarda Formulario principal
      const formularioCreado = await FormularioRepository.createOrUpdate(data, transaccion);
      // Guarda Relacion Formulario Componente
      if (data.componentes) {
        if (data.componentes.length === 0) throw new Error('Debe asignar al menos un componente al Formulario');

        await FormularioComponenteRepository.deleteItemCond({ idFormulario: formularioCreado.id });

        for (const componente of data.componentes) {
          await FormularioComponenteRepository.createOrUpdate({
            idFormulario : formularioCreado.id,
            idComponente : componente.id,
            userCreated  : data.userCreated || data.userUpdated
          }, transaccion);
        }
      }

      await transaction.commit(transaccion);
      return formularioCreado;
    } catch (error) {
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function listarPermisosEntidad (idFormulario) {
    try {
      const { rows: entidades } = await EntidadRepository.findAll();

      let permisosSolicitud = [];

      if (idFormulario) ({ rows: permisosSolicitud } = await PermisoFormularioRepository.findPermisosEntidades({ idFormulario }));
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

  async function listarPermisosAreas (idFormulario) {
    try {
      const { rows: areas } = await AreaRepository.findAll();
      let permisosSolicitud = [];

      if (idFormulario) ({ rows: permisosSolicitud } = await PermisoFormularioRepository.findPermisosAreas({ idFormulario }));

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

  return {
    listarPermisosEntidad,
    listarPermisosAreas,
    listarCampos,
    getFormulariosComponentes,
    listarpor,
    listar,
    createOrUpdate,
    deleteItem,
    createOrUpdateCompleto,
    listarFormulario
  };
};
